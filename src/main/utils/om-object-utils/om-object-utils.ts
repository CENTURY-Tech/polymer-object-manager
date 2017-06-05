namespace Century {

  export namespace OMObjectUtils {

    export type ObjectPart = [string, any];

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

  }

}
