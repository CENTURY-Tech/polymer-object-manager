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
     * A backup of the original "target".
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
     * @todo Complete and document this method.
     */
    public async persistChanges(): Promise<void> {
      //
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
      for (const [lookup] of this.generateDeconstructedTarget()) {
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
      for (const [lookup] of this.generateDeconstructedTarget()) {
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

    /**
     * This method will deconstruct the target Object into it's constituent parts, however, it will only search for
     * Objects. The root of the target Object is also prepended to the list of Object parts.
     *
     * @returns {[String, Any][]} An Array of the target Object's constituent parts including it's root
     */
    private generateDeconstructedTarget(): OMObjectUtils.ObjectPart[] {
      return R.prepend<OMObjectUtils.ObjectPart>(["", this.target], OMObjectUtils.walkObjectFor(this.target, Object));
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
