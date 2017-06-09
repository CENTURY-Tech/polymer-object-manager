namespace Century {

  export namespace OMDiffUtils {

    export interface ArrayPatch {
      value: string;
      toIndex: number;
    };

    /**
     * This method will determine the changes that have been made to "obj2" that distinguish it from "obj1".
     *
     * @private
     *
     * @param {Object} obj1 - The first Object to compare
     * @param {Object} obj2 - The second Object to compare
     *
     * @returns {Object[]} An Array of JSON patches
     */
    function generateJSONPatch<T extends object>(obj1: T, obj2: T): fastjsonpatch.Patch[] {
      return R.reject<fastjsonpatch.Patch>(R.compose(R.test(/\/\$/), R.prop("path")), jsonpatch.compare(obj1, obj2));
    }

    /**
     * This method will apply the supplied Array of JSON patches to the target Object provided.
     *
     * @private
     *
     * @param {Object}   target  - The target Object against which the patches should be applied
     * @param {Object[]} patches - The Array of JSON patches to apply to the target
     *
     * @returns {Object} The original target reference
     */
    function applyJSONPatch<T extends object>(target: T, patches: fastjsonpatch.Patch[]): T {
      // Note that the jsonpatch library applies patches via reference.
      jsonpatch.apply(target, patches);

      return target;
    }

    /**
     * This method will determine the changes that have been made to "obj2" that distinguish it from "obj1".
     *
     * @param {Object} obj1 - The first Object to compare
     * @param {Object} obj2 - The second Object to compare
     *
     * @returns {Object} A JSON merge Object
     */
    export function generateJSONMerge<T extends object>(obj1: T, obj2: T): T {
      return applyJSONPatch<T>(<T>{}, generateJSONPatch(obj1, obj2));
    }

    /**
     * This method will determine a list of insertions in the simplest way possible, however, the number of insertions
     * is not the smallest number, as the list of actions can be N+1 in length, where N = Array.length (the smallest
     * number of insertions would be N-1).
     *
     * @param {String} prop - The property to inspect by
     * @param {Object} arr1 - The first Array to inspect
     * @param {Object} arr2 - The second Array to inspect
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

        patch.push({ value: tracker[largestMove[0]], toIndex: largestMove[1] });
        tracker.splice(largestMove[1], 0, tracker.splice(largestMove[0], 1)[0]);
      }

      return patch;
    }

    /**
     * This method will extract an Array of items that only appear in the first liArrayst.
     *
     * @param {String} prop - The property to inspect by
     * @param {Object} arr1 - The first Array to inspect
     * @param {Object} arr2 - The second Array to inspect
     *
     * @returns {Array} An Array of items that only appear in the first Array
     */
    export function extractDeviantsByProp<T>(prop: string, arr1: T[], arr2: T[]): T[] {
      return R.differenceWith<T>((val1, val2) => R.prop(prop, val1) === R.prop(prop, val2), arr1, arr2);
    }

    /**
     * This method will extract an Array of items from the first Array that also appear in the second Array.
     *
     * @param {String} prop - The property to inspect by
     * @param {Object} arr1 - The first Array to inspect
     * @param {Object} arr2 - The second Array to inspect
     *
     * @returns {Array} An Array of items from the first Array that also appear in the second Array
     */
    export function extractIntersectionsByProp<T>(prop: string, arr1: T[], arr2: T[]): T[] {
      return R.filter<T>(R.compose<any, any, any>(R.flip(R.contains)(R.map(R.prop(prop), arr2)), R.prop(prop)), arr1);
    }

  }

}
