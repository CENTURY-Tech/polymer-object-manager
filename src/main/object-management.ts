namespace Century {

  type ValidationError = ZSchema.SchemaErrorDetail;

  /**
   * Object Management behaviour.
   *
   * @class
   * @extends polymer.Base
   */
  export class ObjectManagement<T extends object> extends polymer.Base {

    /**
     * The target Object to be managed. Upon assigning the target, a clone of the target is made and stored privately to
     * allow for use during change detection and resetting later on.
     */
    @property({ type: Object, notify: true })
    public target: T;

    /**
     * The schema with which to perform any validation. This must be a valid JSON schema, and is only required to cover
     * keys on the target that need to be validated, any other keys will be ignored.
     */
    @property({ type: Object })
    public schema: object;

    /**
     * An Array of sorting handlers instruct the behaviour how to handle changes in Arrays found within the target
     * Object.
     */
    @property({ type: Object })
    public sortHandlers: OMHandlerUtils.SortHandler[];

    /**
     * An Array of merge handlers that instruct the behaviour how to handle changes in Objects found within the target
     * Object.
     */
    @property({ type: Object })
    public mergeHandlers: OMHandlerUtils.MergeHandler[];

    /**
     * A backup copy of the target.
     */
    private original: T;

    /**
     * An instance of the ZSchema class, used for validation purposes.
     */
    private validator: ZSchema;

    /**
     * This lifecycle method is used as a constructor, as constructors are not called on Behaviours. This limitation
     * prevents us from initialising the required private variables within the declaration of the class properties when
     * transpiling down to ES5. Because Typescript + Polymer = A big bag of fun...
     *
     * @returns {Void}
     */
    public created(): void {
      this.validator = new ZSchema({ breakOnFirstError: false });
    }

    /**
     * This method calculates the changes made to the target Object, and then parses those changes according handlers
     * that should have previously been assigned, if no handlers are found, then the method will resolve immediately.
     *
     * @returns {Promise<Void>}
     */
    public async persistChanges(): Promise<void> {
      for (const sortHandler of this.sortHandlers || []) {
        // Skip the handler if it has been flagged as invalid
        if (sortHandler.invalid) {
          continue;
        }

        const searchResults = OMHandlerUtils.getSearchObject(sortHandler, {
          target: this.target,
          original: this.original
        });

        const pickKeys = R.curry(OMHandlerUtils.pickRelevantKeys)(sortHandler);
        const findIndex = R.curry(OMDiffUtils.findIndexByProp)(sortHandler.itemSignature);

        /**
         * Added lists are Arrays that have been added to the target Object, and therefore have no common parent within
         * the original Object.
         *
         * Added lists can only emit the following event: "inherited-addition"
         */
        for (const { target } of OMHandlerUtils.retrieveAddedLists(sortHandler, searchResults)) {
          for (const inheritedAddition of target[1]) {
            await sortHandler.handler("inherited-addition", target[0], pickKeys(inheritedAddition), {
              ref: inheritedAddition,
              toIndex: findIndex(target[1], inheritedAddition)
            });
          }
        }

        /**
         * Shared lists are Arrays that are found in both the target Object and the original Object, because they share
         * a common parent in both the Objects.
         *
         * Shared lists can emit any of the following events: "removal", "move", and "addition".
         */
        for (const { target, original } of OMHandlerUtils.retrieveSharedLists(sortHandler, searchResults)) {
          const extractDeviants = R.curry(OMDiffUtils.extractDeviantsByProp)(sortHandler.itemSignature);
          const generateArraySort = R.curry(OMDiffUtils.generateArraySortByProp)(sortHandler.itemSignature);
          const extractIntersections = R.curry(OMDiffUtils.extractIntersectionsByProp)(sortHandler.itemSignature);

          for (const removal of extractDeviants(original[1], target[1])) {
            await sortHandler.handler("removal", target[0], pickKeys(removal), {
              ref: removal,
              fromIndex: findIndex(original[1], removal)
            });
          }

          for (const move of generateArraySort(
            extractIntersections(original[1], target[1]),
            extractIntersections(target[1], original[1])
          )) {
            await sortHandler.handler("move", target[0], pickKeys(move.ref), move);
          }

          for (const addition of extractDeviants(target[1], original[1])) {
            await sortHandler.handler("addition", target[0], pickKeys(addition), {
              ref: addition,
              toIndex: findIndex(target[1], addition)
            });
          }
        }

        /**
         * Removed lists are Arrays that still exist in the original Object, but are no longer available in the target
         * Object.
         *
         * Removed lists can only emit the following event: "inherited-removal"
         */
        for (const { original } of OMHandlerUtils.retrieveRemovedLists(sortHandler, searchResults)) {
          for (const inheritedRemoval of original[1]) {
            await sortHandler.handler("inherited-removal", original[0], pickKeys(inheritedRemoval), {
              ref: inheritedRemoval,
              fromIndex: findIndex(original[1], inheritedRemoval)
            });
          }
        }
      }

      for (const mergeHandler of this.mergeHandlers || []) {
        // Skip the handler if it has been flagged as invalid
        if (mergeHandler.invalid) {
          continue;
        }

        const searchResults = OMHandlerUtils.getSearchObject(mergeHandler, {
          target: this.target,
          original: this.original
        });

        const pickKeys = R.curry(OMHandlerUtils.pickRelevantKeys)(mergeHandler);

        /**
         * Shared Objects are Objects that are found in both the target Object and the original Object.
         *
         * Shared Object can onl emit the following event: "update".
         */
        for (const sharedObject of OMHandlerUtils.retrieveSharedObjects(mergeHandler, searchResults)) {
          const merge = OMDiffUtils.generateJSONMerge(
            pickKeys(sharedObject.original[1]),
            pickKeys(sharedObject.target[1])
          );

          if (!R.isEmpty(<any>merge)) {
            await mergeHandler.handler("update", sharedObject.target[0], merge, {
              targetRef: sharedObject.target[1],
              originalRef: sharedObject.original[1]
            });
          }
        }
      }

      this.handleTargetUpdated({ base: this.target, path: "target" });
    }

    /**
     * This method will reset the target Object to it's original state.
     *
     * @returns {Void}
     */
    public resetChanges(): void {
      this.set("target", this.original);
    }

    /**
     * This method will validate the target Object against the provided schema, if available. After validating the
     * target Object, any errors generated during the validation process will be processed.
     *
     * @returns {Void}
     */
    public validateChanges(): void {
      if (!this.target || !this.schema || !this.validator) {
        return;
      }

      this.validator.validate(this.target, this.schema);
      this.processTargetErrors(this.validator.getLastErrors() || []);
    }

    /**
     * This method will handle any updates made to the target Object. If the Object is being set, a clone will be made
     * and referenced for later usage. If however, Object is being updated, it is marked as dirty, and then validated.
     *
     * @param {Object} diff - A Polymer diff Object
     *
     * @returns {Void}
     */
    @observe("target.*")
    public handleTargetUpdated(diff: { base: T, path: string }): void | boolean {
      // We ignore whenever a property is updated prefixed with a "$".
      if (/\.\$/.test(diff.path)) {
        return false;
      }

      if (/^target$/.test(diff.path)) {
        this.original = R.clone(diff.base);

        this.prepareTargetRoots();
        this.markTargetPathAsPristine([]);
      } else {
        this.markTargetPathAsDirty([]);
      }

      return this.validateChanges();
    }

    /**
     * This method will validate each of the sort handlers, and in the event that a handler is seen to be incorrectly
     * setup for the current target Object, it will be marked as invalid.
     *
     * @param {Object[]} sortHandlers - An Array of sort handlers
     * @param {Object}   target       - The target Object
     *
     * @returns {Void}
     */
    @observe("sortHandlers, target")
    public handleSortHandersAssigned(sortHandlers: OMHandlerUtils.SortHandler[], target: T): void {
      for (const sortHandler of sortHandlers) {
        const searchLitmus = OMObjectUtils.walkObjectByLookupRegex(target, sortHandler.search);

        if (searchLitmus.some((objectPart) => objectPart[1].constructor !== Array)) {
          console.warn("Expected all search results to be Arrays, please refine the search Regex: ", sortHandler);

          // Flag the handler as invalid
          sortHandler.invalid = true;
        }
      }
    }

    /**
     * This method will validate each of the merge handlers, and in the event that a handler is seen to be incorrectly
     * setup for the current target Object, it will be marked as invalid.
     *
     * @param {Object[]} mergeHandlers - An Array of merge handlers
     * @param {Object}   target        - The target Object
     *
     * @returns {Void}
     */
    @observe("mergeHandlers, target")
    public handleMergeHandlersAssigned(mergeHandlers: OMHandlerUtils.MergeHandler[], target: T): void {
      for (const mergeHandler of mergeHandlers) {
        const searchLitmus = OMObjectUtils.walkObjectByLookupRegex(target, mergeHandler.search);

        if (searchLitmus.some((objectPart) => objectPart[1].constructor !== Object)) {
          console.warn("Expected all search results to be Objects, please refine the search Regex: ", mergeHandler);

          // Flag the handler as invalid
          mergeHandler.invalid = true;
        }
      }
    }

    /**
     * This method will mark the Object at the lookup path provided as pristine (that is untouched). This will falsify
     * the "$dirty" flag at the lookup path specified on the target and make the "$pristine" flag truthy.
     *
     * @param {String[]} path - An Array of Object keys forming a lookup path
     *
     * @returns {Void}
     */
    private markTargetPathAsPristine(path: string[]): void {
      const lookup = OMPathUtils.pathToLookup(["target", ...path]);

      this.set(`${lookup}.$dirty`, false);
      this.set(`${lookup}.$pristine`, true);
    }

    /**
     * This method will mark the Object at the lookup path provided as as dirty (that it has had changes made). This
     * will falsify the "$pristine" flag at the lookup path specified on the target and make the "$dirty" flag truthy.
     *
     * @param {String[]} path - An Array of Object keys forming a lookup path
     *
     * @returns {Void}
     */
    private markTargetPathAsDirty(path: string[]): void {
      const lookup = OMPathUtils.pathToLookup(["target", ...path]);

      this.set(`${lookup}.$dirty`, true);
      this.set(`${lookup}.$pristine`, false);
    }

    /**
     * This method will mark the Object at the lookup path provided as valid. This will falsify the "$invalid" flag, and
     * make the "$valid" flag truthy.
     *
     * @param {String[]} path - An Array of Object keys forming a lookup path
     *
     * @returns {Void}
     */
    private markTargetPathAsValid(path: string[]): void {
      const lookup = OMPathUtils.pathToLookup(["target", ...path]);

      this.set(`${lookup}.$valid`, true);
      this.set(`${lookup}.$invalid`, false);
    }

    /**
     * This method will mark the Object at the lookup path provided as invalid. This will falsify the "$valid" flag, and
     * make the "$invalid" flag truthy.
     *
     * @param {String[]} path - An Array of Object keys forming a lookup path
     *
     * @returns {Void}
     */
    private markTargetPathAsInvalid(path: string[]): void {
      const lookup = OMPathUtils.pathToLookup(["target", ...path]);

      this.set(`${lookup}.$valid`, false);
      this.set(`${lookup}.$invalid`, true);
    }

    /**
     * This method will assign the provided root to a key named "$root" on the target Object at the lookup path
     * provided.
     *
     * @param {String}   root - The root to be set at the lookup path provided
     * @param {String[]} path - An Array of Object keys forming a lookup path
     *
     * @returns {Void}
     */
    private setTargetPathRoot(root: string, path: string[]): void {
      this.set(`${OMPathUtils.pathToLookup(["target", ...path])}.$root`, root);
    }

    /**
     * This method will assign the provided errors to a key named "$errors" on the target Object at the lookup path
     * provided.
     *
     * @param {Object[]} errors - The errors to be set at the lookup path provided
     * @param {String[]} path   - An Array of Object keys forming a lookup path
     *
     * @returns {Void}
     */
    private setTargetPathErrors(errors: ValidationError[], path: string[]): void {
      this.set(`${OMPathUtils.pathToLookup(["target", ...path])}.$errors`, errors);
    }

    /**
     * This method will initialise the root path for every Object in the target Object.
     *
     * @returns {Void}
     */
    private prepareTargetRoots(): void {
      for (const [lookup] of OMObjectUtils.walkObjectByValueType(this.target, Object)) {
        const path = OMPathUtils.lookupToPath(lookup);
        const root = OMPathUtils.pathToRoot(path);

        this.setTargetPathRoot(root, path);
      }
    }

    /**
     * This method will populate the errors provided throughout the target Object.
     *
     * @param {Object[]} errors - The errors to be populated throughout the target Object
     *
     * @returns {Void}
     */
    private processTargetErrors(errors: ValidationError[]): void {
      for (const [lookup] of OMObjectUtils.walkObjectByValueType(this.target, Object)) {
        const path = OMPathUtils.lookupToPath(lookup);
        const root = OMPathUtils.pathToRoot(path);

        this.assignTargetErrorsForPath(OMPathUtils.getErrorsForRoot(errors, root, true), path);
      }
    }

    /**
     * This method will assign the errors provided to the target Object at the lookup path provided, and will then
     * proceed to update the validity signature of the Object at the lookup path provided.
     *
     * @param {Object[]} errors - The errors to be populated throughout the target Object
     * @param {String[]} path   - An Array of Object keys forming a lookup path
     *
     * @returns {Void}
     */
    private assignTargetErrorsForPath(errors: ValidationError[], path: string[]): void {
      this.setTargetPathErrors(errors, path);

      if (!errors.length) {
        this.markTargetPathAsValid(path);
      } else {
        this.markTargetPathAsInvalid(path);
      }
    }

  }

  export namespace ObjectManagement {

    const uuids: string[] = [];

    /**
     * The method will check to see if the UUID provided has been generated on the client, and is there temporary.
     *
     * @param {String} uuid - The unique ID to be checked
     *
     * @returns {Boolean} Whether or not the UUID is temporary
     */
    export function isTempUUID(uuid: string): boolean {
      return R.contains(uuid, uuids);
    }

    /**
     * This method will generate a unique ID to act as a placeholder for newly created Strands and Nuggets.
     *
     * @return {String} A unique ID
     */
    export function generateTempUUID(): string {
      return (uuids[uuids.length] = uuids.length.toString(36));
    }

  }

}
