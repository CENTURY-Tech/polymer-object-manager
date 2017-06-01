namespace Century {

  type ValidationError = ZSchema.SchemaErrorDetail;

  const validator = new ZSchema({
    breakOnFirstError: false
  });

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
     * An backup of the original "target".
     */
    private original: T;

    public async persistChanges(): Promise<void> {
      //
    }

    public resetChanges(): void {
      this.set("target", R.clone(this.original));
    }

    public validateChanges(): void {
      if (!this.target || !this.schema) {
        return;

      }
      validator.validate(this.target, this.schema);
      this.processTargetErrors(validator.getLastErrors());
    }

    @observe("target.*")
    public handleTargetUpdated(diff: { base: T, path: string }): void {
      // We ignore whenever a property is updated prefixed with a "$".
      if (/\.\$/.test(diff.path)) {
        return;
      }

      if (/^target$/.test(diff.path)) {
        this.original = R.clone(diff.base);

        this.prepareTargetRoots();
        this.markTargetPathAsPristine();
      } else {
        this.markTargetPathAsDirty();
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
    private markTargetPathAsPristine(path: string[] = []): void {
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
    private markTargetPathAsDirty(path: string[] = []): void {
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
    private markTargetPathAsValid(path: string[] = []): void {
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
    private markTargetPathAsInvalid(path: string[] = []): void {
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
      for (const [lookup] of ObjectManagement.walkObjectFor(this.target, Object)) {
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
      for (const [lookup] of ObjectManagement.walkObjectFor(this.target, Object)) {
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
        this.markTargetPathAsValid();
      } else {
        this.markTargetPathAsInvalid();
      }
    }

  }

  export namespace ObjectManagement {

    export const deconstructObject: <T extends object>(obj: T) => Array<[string, any]> = R.compose<any, any, any>(
      R.chain(([key1, value1]: [string, any]): string[][] => {
        if (typeof value1 === "object") {
          return [[key1, value1], ...R.map(([key2, value2]) => [`${key1}.${key2}`, value2], deconstructObject(value1))];
        } else {
          return [[key1, value1]];
        }
      }),
      R.toPairs
    );

    export function walkObjectFor<T extends object>(obj: T, type: any): Array<[string, any]> {
      return R.filter<[string, any]>(R.pipe(R.nth(1), R.is(type)), deconstructObject(obj));
    }

    /**
     * This method will generate a root string from the lookup path provided.
     *
     * @param {String[]} path - An Array of Object keys forming a lookup path
     *
     * @returns {String} A root built from the lookup path provided
     */
    export function pathToRoot(path: string[] = []): string {
      return `#/${R.join("/", path)}`;
    }

    /**
     * This method will generate a single lookup string from the lookup path provided.
     *
     * @param {String[]} path - An Array of Object keys forming a lookup path
     *
     * @returns {String} A single lookup string built from the lookup path provided
     */
    export function pathToLookup(path: string[] = []): string {
      return R.join(".", path);
    }

    /**
     * This method will generate an Array of Object keys single from the lookup string provided.
     *
     * @param {String[]} lookup - A single lookup string
     *
     * @returns {String} An Array of Object keys forming a lookup path
     */
    export function lookupToPath(lookup: string = ""): string[] {
      return R.split(".", lookup);
    }

    /**
     * Retrieve the errors from the Array of errors provided that point to the path provided.
     *
     * @param {Object[]} errors - The Array of validation errors
     * @param {String}   path   - The error path to filter by
     *
     * @returns {Object[]} An Array of errors with the path provided
     */
    export function getErrorsForPath<T extends ValidationError>(errors: T[], path: string): T[] {
      return R.filter<T>(R.propEq("path", path))(errors);
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
      return R.filter<T>(R.propSatisfies(R.test(RegExp(`^${root}${!recursive ? "\w+$" : ""}`)), "path"))(errors);
    }

  }

}
