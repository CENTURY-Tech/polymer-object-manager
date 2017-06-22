namespace Century {

  /**
   * @namespace Century.OMDiffUtils
   */
  export namespace OMDiffUtils {

    export interface ArrayPatch {
      ref: any;
      toIndex: number;
    }

    /**
     * This method will determine the changes that have been made to "obj2" that distinguish it from "obj1".
     *
     * @memberof Century.OMDiffUtils
     * @function generateObjectMerge
     *
     * @param {Object} obj1 - The first Object to compare
     * @param {Object} obj2 - The second Object to compare
     *
     * @returns {Object} A JSON merge Object
     */
    export function generateObjectMerge<T extends object>(obj1: T, obj2: T): T {
      return R.reduce<any, T>((acc, [key, val]) => {
        if (!R.has(key, obj2)) {
          acc[key] = null;
        } else if (!R.equals(val, obj2[key])) {
          acc[key] = val && val.constructor === Object && obj2[key] && obj2[key].constructor === Object
            ? generateObjectMerge(val, obj2[key])
            : obj2[key];
        }

        return acc;
      }, R.pick<T, T>(R.difference(R.keys(obj2), R.keys(obj1)), obj2), R.toPairs(obj1));
    }

    /**
     * This method will determine a list of insertions in the simplest way possible, however, the number of insertions
     * is not the smallest number, as the list of actions can be N+1 in length, where N = Array.length (the smallest
     * number of insertions would be N-1).
     *
     * @memberof Century.OMDiffUtils
     * @function generateArraySortByProp
     *
     * @param {String} prop - The property to inspect by
     * @param {Array}  arr1 - The first Array to inspect
     * @param {Array}  arr2 - The second Array to inspect
     *
     * @returns {Array} An ordered Array of insertions
     */
    export function generateArraySortByProp(prop: string, arr1: any[], arr2: any[]): ArrayPatch[] {
      const patch: ArrayPatch[] = [];
      const tracker = Array.from(arr1);
      const order = R.map(R.prop(prop), arr2);

      for (let i = 0; i < arr1.length + 1; i++) {
        const largestMove = tracker.reduce((acc: number[], val: string, index: number): number[] => {
          const currentMove = [index, order.indexOf(R.prop(prop, val))];

          if (Math.abs(currentMove[0] - currentMove[1]) > Math.abs(acc[0] - acc[1])) {
            return currentMove;
          } else {
            return acc;
          }
        }, [0, 0]);

        if (!largestMove[0] && !largestMove[1]) {
          break;
        }

        patch.push({ ref: tracker[largestMove[0]], toIndex: largestMove[1] });
        tracker.splice(largestMove[1], 0, tracker.splice(largestMove[0], 1)[0]);
      }

      return patch;
    }

    /**
     * This method will find and return the index of the value in the Array that shares the property value of the
     * provided key.
     *
     * @memberof Century.OMDiffUtils
     * @function findIndexByProp
     *
     * @param {String} prop  - The property to inspect by
     * @param {Array}  arr   - The Array to inspect
     * @param {Object} value - The value to search for
     *
     * @returns {Number} The index of the Object provided in the Array provided
     */
    export function findIndexByProp<T>(prop: string, arr: T[], value: T): number {
      return R.findIndex(R.propEq(prop, R.prop(prop, value)), arr);
    }

    /**
     * This method will extract an Array of items that only appear in the first liArrayst.
     *
     * @memberof Century.OMDiffUtils
     * @function extractDeviantsByProp
     *
     * @param {String} prop - The property to inspect by
     * @param {Array}  arr1 - The first Array to inspect
     * @param {Array}  arr2 - The second Array to inspect
     *
     * @returns {Array} An Array of items that only appear in the first Array
     */
    export function extractDeviantsByProp<T>(prop: string, arr1: T[], arr2: T[]): T[] {
      return R.differenceWith<T>((val1, val2) => R.prop(prop, val1) === R.prop(prop, val2), arr1, arr2);
    }

    /**
     * This method will extract an Array of items from the first Array that also appear in the second Array.
     *
     * @memberof Century.OMDiffUtils
     * @function extractIntersectionsByProp
     *
     * @param {String} prop - The property to inspect by
     * @param {Array}  arr1 - The first Array to inspect
     * @param {Array}  arr2 - The second Array to inspect
     *
     * @returns {Array} An Array of items from the first Array that also appear in the second Array
     */
    export function extractIntersectionsByProp<T>(prop: string, arr1: T[], arr2: T[]): T[] {
      return R.filter<T>(R.compose<any, any, any>(R.flip(R.contains)(R.map(R.prop(prop), arr2)), R.prop(prop)), arr1);
    }

  }

}
