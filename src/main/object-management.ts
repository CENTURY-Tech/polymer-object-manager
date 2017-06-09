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
      // this.set("target", {
      //   _id: "957e3ae2-d8e5-4bb8-95c6-9d0e4c1da35e",
      //   name: "Iain's course 👨🏼‍💻",
      //   organisation: "4af9f952-4d5f-4cff-9fce-0f1163c138b9",
      //   description: "😳 🍮 🍔",
      //   history: {
      //     firstVersion: {
      //       createdAt: "2016-12-01T12:00:15.918Z",
      //       createdBy: "3692f1a9-038b-461c-a2bb-52d95097a91c",
      //     },
      //     thisVersion: {
      //       isDeprecated: false,
      //       version: 237,
      //       prevId: "5ba24732-022e-49d4-b180-8860c7a04cfa",
      //       updatedAt: "2017-06-05T16:32:54.545Z",
      //       updatedBy: "3692f1a9-038b-461c-a2bb-52d95097a91c",
      //     },
      //   },
      //   isPublished: true,
      //   isEnabled: true,
      //   isTest: false,
      //   isPublic: false,
      //   labels: [
      //     {
      //       _id: "03d06410-e23f-41bd-a661-878d5a2ee9ea",
      //       name: "⌨",
      //       colour: "#c153fc",
      //     },
      //     {
      //       _id: "201b02ba-33f2-45ff-991b-09497da78277",
      //       name: "🤡",
      //       colour: "#9bf291",
      //     }
      //   ],
      //   strands: [
      //     {
      //       name: "Emoji time 🍕",
      //       nuggets: [
      //         {
      //           _id: "ec966293-c864-47e9-ac28-186dd163fa2f",
      //           name: "🍗",
      //           isPublished: false,
      //           isPublic: false,
      //           prerequisites: [
      //             "57605ba5-82f4-4fdf-a2f5-364d64815492"
      //           ],
      //         },
      //         {
      //           _id: "57605ba5-82f4-4fdf-a2f5-364d64815492",
      //           name: "🐔",
      //           isPublished: false,
      //           isPublic: false,
      //           prerequisites: [],
      //         },
      //         {
      //           _id: "ad7a20a3-84b3-42f7-9132-50b2682a1ee6",
      //           name: "🥔",
      //           isPublished: false,
      //           isPublic: false,
      //           prerequisites: [],
      //         }
      //       ],
      //       weight: 0,
      //       id: "c380ceae-143b-4967-9520-15dd2fc09831",
      //     },
      //     {
      //       name: "New strand",
      //       nuggets: [
      //         {
      //           _id: "14b25287-8fe4-4d5b-a4f3-60d4ca92f685",
      //           name: "1",
      //           isPublished: false,
      //           isPublic: false,
      //           prerequisites: [],
      //         },
      //         {
      //           _id: "c3f62bbb-a708-450e-8843-9c3b15daf375",
      //           name: "2",
      //           isPublished: false,
      //           isPublic: false,
      //           prerequisites: [],
      //         },
      //         {
      //           _id: "fcfe22c3-d22e-40ae-9e76-24d6bd60e973",
      //           name: "3",
      //           isPublished: false,
      //           isPublic: false,
      //           prerequisites: [],
      //         },
      //         {
      //           _id: "1794fb5d-045a-428e-9900-0744d6f37050",
      //           name: "4",
      //           isPublished: false,
      //           isPublic: false,
      //           prerequisites: [],
      //         },
      //         {
      //           _id: "232f6861-0874-4ba4-9d51-95666104c6d9",
      //           name: "5",
      //           isPublished: false,
      //           isPublic: false,
      //           prerequisites: [],
      //         },
      //         {
      //           _id: "cecc0918-7150-472b-a50c-07fcf0f877e1",
      //           name: "6",
      //           isPublished: false,
      //           isPublic: false,
      //           prerequisites: [],
      //         }
      //       ],
      //       weight: 0,
      //       id: "adb407a6-f471-4931-813b-9184655b1784",
      //     }
      //   ],
      //   type: "standard",
      //   __v: 224,
      //   level: {
      //     _id: "923e1b3d-8452-4e98-8b90-685da32a596b",
      //     name: "A Level",
      //     colour: "",
      //   },
      //   subject: {
      //     _id: "d2fb0442-7ad3-4ac8-9b08-86bd3efa5aab",
      //     name: "Mathematics",
      //     colour: "",
      //   },
      // });

      for (const sortHandler of this.sortHandlers || []) {
        const searchResults = OMHandlerUtils.getSearchObject(sortHandler, {
          target: this.target,
          original: this.original
        });

        const extractDeviants = R.curry(OMDiffUtils.extractDeviantsByProp)(sortHandler.itemSignature);
        const generateArraySort = R.curry(OMDiffUtils.generateArraySortByProp)(sortHandler.itemSignature);
        const extractIntersections = R.curry(OMDiffUtils.extractIntersectionsByProp)(sortHandler.itemSignature);

        /**
         * Added lists are Arrays that have been added to the target Object, and therefore have no common parent within
         * the original Object.
         *
         * Added lists can only emit the following event: "inherited-addition"
         */
        for (const addedList of OMHandlerUtils.retrieveAddedLists(sortHandler, searchResults)) {
          for (const inheritedAddition of addedList.target[1]) {
            console.log("inherited-addition", addedList.target[0], inheritedAddition);
          }
        }

        /**
         * Shared lists are Arrays that are found in both the target Object and the original Object, because they share
         * a common parent in both the Objects.
         *
         * Shared lists can emit any of the following events: "removal", "move", and "addition".
         */
        for (const sharedList of OMHandlerUtils.retrieveSharedLists(sortHandler, searchResults)) {
          for (const removal of extractDeviants(sharedList.original[1], sharedList.target[1])) {
            console.log("removal", sharedList.target[0], removal);
          }

          for (const move of generateArraySort(
            extractIntersections(sharedList.original[1], sharedList.target[1]),
            extractIntersections(sharedList.target[1], sharedList.original[1])
          )) {
            console.log("move", sharedList.target[0], move);
          }

          for (const addition of extractDeviants(sharedList.target[1], sharedList.original[1])) {
            console.log("addition", sharedList.target[0], addition);
          }
        }

        /**
         * Removed lists are Arrays that still exist in the original Object, but are no longer available in the target
         * Object.
         *
         * Removed lists can only emit the following event: "inherited-removal"
         */
        for (const removedList of OMHandlerUtils.retrieveRemovedLists(sortHandler, searchResults)) {
          for (const inheritedRemoval of removedList.original[1]) {
            console.log("inherited-removal", removedList.original[0], inheritedRemoval);
          }
        }
      }

      for (const mergeHandler of this.mergeHandlers || []) {
        const searchResults = OMHandlerUtils.getSearchObject(mergeHandler, {
          target: this.target,
          original: this.original
        });

        /**
         * Shared Objects are Objects that are found in both the target Object and the original Object.
         *
         * Shared Object can onl emit the following event: "updated".
         */
        for (const sharedObject of OMHandlerUtils.retrieveSharedObjects(mergeHandler, searchResults)) {
          const merge = OMDiffUtils.generateJSONMerge(
            OMHandlerUtils.getRelevantKeys(mergeHandler, sharedObject.original[1]),
            OMHandlerUtils.getRelevantKeys(mergeHandler, sharedObject.target[1])
          );

          if (!R.isEmpty(<any>merge)) {
            console.log("update", sharedObject.target[0], merge);
          }
        }
      }
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

    @observe("sortHandlers")
    public handleSortHandersAssigned(sortHandlers: OMHandlerUtils.SortHandler[]): void {
      // VALIDATE HANDLERS
    }

    @observe("mergeHandlers")
    public handleMergeHandlersAssigned(mergeHandlers: OMHandlerUtils.MergeHandler[]): void {
      // VALIDATE HANDLERS
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
