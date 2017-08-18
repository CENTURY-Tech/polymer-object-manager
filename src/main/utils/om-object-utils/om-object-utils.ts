namespace Century {

  export namespace OMObjectUtils {

    /**
     * A mixed Array containing values at the zeroth and first indexes. The zeroth index contains a lookup path to a
     * value in the targeted Object, and the first index contains a reference to that value, unless the value is neither
     * an Object nor Array, when it would therefore be a value.
     */
    export type ObjectPart = [string, any];

    /**
     * This method breaks down the provided Object into it's constituent parts and returns an Array of Arrays, where
     * each Subarray contains a lookup string at the zeroth index, and a reference to the value held at that lookup
     * string in the first index.
     *
     * @param {Object} obj - The Object to be deconstructed
     *
     * @returns {ObjectPart[]} An Array of the Object's constituent parts
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
     * This method will search through the provided Object for values that satisfy the provided condition. It will then
     * return an Array of Arrays, where each Subarray contians a lookup string to the match at the zeroth index, and
     * then a reference to the match in the first index.
     *
     * @param {Object}   obj       - The Object to be searched
     * @param {Function} condition - A condition to be met to be included in the output
     *
     * @returns {ObjectPart[]} An Array of matches found in the Object that satisfy the provided condition
     */
    export function walkObjectBy<T extends object>(obj: T, condition: (ObjectPart) => boolean): ObjectPart[] {
      return R.filter<ObjectPart>(condition)([["", obj], ...deconstructObject(obj)]);
    }

    /**
     * This method will search through the provided Object for values that match the provided type. It will then return
     * an Array of Arrays, where each Subarray contians a lookup string to the match at the zeroth index, and then a
     * reference to the match in the first index.
     *
     * @param {Object} obj  - The Object to be searched
     * @param {Object} type - The type to search for
     *
     * @returns {ObjectPart[]} An Array of matches found in the Object for the specified type
     */
    export function walkObjectByValueType<T extends object>(obj: T, type: Function): ObjectPart[] {
      return walkObjectBy<T>(obj, ([, value]) => value && value.constructor === type);
    }

    /**
     * This method will search through the provided Object for lookups that match the provided Regular Expression. It
     * will then return an Array of Arrays, where each Subarray contians a lookup string to the match at the zeroth
     * index, and then a reference to the match in the first index.
     *
     * @param {Object} obj   - The Object to be searched
     * @param {RegExp} regex - The Regular Expression to search by
     *
     * @returns {ObjectPart[]} An Array of matches found in the Object with lookups that pass the Regular Expression
     */
    export function walkObjectByLookupRegex<T extends object>(obj: T, regex: RegExp): ObjectPart[] {
      return walkObjectBy<T>(obj, ([lookup]) => regex.test(lookup));
    }

  }

}
