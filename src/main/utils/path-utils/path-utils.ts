namespace Century {

  export namespace PathUtils {

    export type ValidationError = ZSchema.SchemaErrorDetail;

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
     * This method will generate an Array of Object keys from the root string provided.
     *
     * @param {String} root - A single root string
     *
     * @returns {String} An Array of Object keys forming a lookup path
     */
    export function rootToPath(root: string): string[] {
      return R.pipe<string, string[], string[], string[]>(R.split("/"), R.tail, R.reject(R.isEmpty))(root);
    }

    /**
     * This method will generate an Array of Object keys from the lookup string provided.
     *
     * @param {String} lookup - A single lookup string
     *
     * @returns {String} An Array of Object keys forming a lookup path
     */
    export function lookupToPath(lookup: string): string[] {
      return R.pipe<string, string[], string[]>(R.split("."), R.reject(R.isEmpty))(lookup);
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
      return R.filter<T>(R.propSatisfies(R.test(RegExp(`^${root}${recursive ? "" : "$"}`)), "path"), errors);
    }

  }

}
