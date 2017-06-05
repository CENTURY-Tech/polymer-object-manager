namespace Century {

  type ObjectPart = [string, any];
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
      const lookup = ObjectManagement.pathToLookup(["target", ...path]);

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
      const lookup = ObjectManagement.pathToLookup(["target", ...path]);

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
      const lookup = ObjectManagement.pathToLookup(["target", ...path]);

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
      const lookup = ObjectManagement.pathToLookup(["target", ...path]);

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
      this.set(`${ObjectManagement.pathToLookup(["target", ...path])}.$root`, root);
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
      this.set(`${ObjectManagement.pathToLookup(["target", ...path])}.$errors`, errors);
    }

    /**
     * This method will initialise the root path for every Object in the target Object.
     *
     * @returns {Void}
     */
    private prepareTargetRoots(): void {
      for (const [lookup] of this.generateDeconstructedTarget()) {
        const path = ObjectManagement.lookupToPath(lookup);
        const root = ObjectManagement.pathToRoot(path);

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
        const path = ObjectManagement.lookupToPath(lookup);
        const root = ObjectManagement.pathToRoot(path);

        this.assignTargetErrorsForPath(ObjectManagement.getErrorsForRoot(errors, root, true), path);
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
    private generateDeconstructedTarget(): ObjectPart[] {
      return R.prepend<ObjectPart>(["", this.target], ObjectManagement.walkObjectFor(this.target, Object));
    }

  }

  export namespace ObjectManagement {

    /**
     * This method breaks down the provided Object into it's constituent parts and returns an Array of Arrays, where
     * each Subarray contains a lookup string at the zeroth index, and a reference to the value held at that lookup
     * string in the first index.
     *
     * @param {Object} obj - The Object to be deconstructed
     *
     * @returns {[String, Any][]} An Array of the Object's constituent parts
     */
    export const deconstructObject: <T extends object>(obj: T) => ObjectPart[] = R.compose<any, any, any>(
      R.chain(([key1, value1]: ObjectPart): any => {
        if (key1.startsWith("$")) {
          return [];
        } else if (typeof value1 === "object") {
          return [[key1, value1], ...R.map(([key2, value2]) => [`${key1}.${key2}`, value2], deconstructObject(value1))];
        } else {
          return [[key1, value1]];
        }
      }),
      R.toPairs
    );

    /**
     * This method will search through the provided Object for values that match the provided type. It will then return
     * an Array of Arrays, where each Subarray contians a lookup string to the match at the zeroth index, and then a
     * reference to the match in the first index.
     *
     * @param {Object} obj  - The Object to be searched
     * @param {Object} type - The type to search for
     *
     * @returns {[String, Any][]} An Array of matches found in the Object for the specified type
     */
    export function walkObjectFor<T extends object, U extends Function>(obj: T, type: U): ObjectPart[] {
      return R.filter<ObjectPart>(R.pipe(R.nth(1), (x) => (x instanceof type)), deconstructObject(obj));
    }

    /**
     * This method will generate a root string from the lookup path provided.
     *
     * @param {String[]} path - An Array of Object keys forming a lookup path
     *
     * @returns {String} A root built from the lookup path provided
     */
    export function pathToRoot(path: string[]): string {
      return `#/${R.join("/", path)}`;
    }

    /**
     * This method will generate a single lookup string from the lookup path provided.
     *
     * @param {String[]} path - An Array of Object keys forming a lookup path
     *
     * @returns {String} A single lookup string built from the lookup path provided
     */
    export function pathToLookup(path: string[]): string {
      return R.join(".", path);
    }

    /**
     * This method will generate an Array of Object keys single from the lookup string provided.
     *
     * @param {String[]} lookup - A single lookup string
     *
     * @returns {String} An Array of Object keys forming a lookup path
     */
    export function lookupToPath(lookup: string): string[] {
      return R.compose(R.reject<string>(R.isEmpty), R.split("."))(lookup);
    }

    /**
     * Retrieve the errors from the Array of errors provided that stem from the "root" provided.
     *
     * @param {Object[]} errors    - The Array of validation errors
     * @param {String}   root      - The root to filter by
     * @param {Boolean=} recursive - Whether or not the filtered results should be recursively retrieved
     *
     * @returns {Object[]} An Array of errors stemming from the root provided
     */
    export function getErrorsForRoot<T extends ValidationError>(errors: T[], root: string, recursive?: boolean): T[] {
      return R.filter<T>(R.propSatisfies(R.test(RegExp(`^${root}${recursive ? "" : "$"}`)), "path"))(errors);
    }

  }

}
