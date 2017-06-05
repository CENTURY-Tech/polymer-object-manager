namespace Century {

  export namespace OMDiffUtils {

    export interface ArrayPatch {
      value: string;
      toIndex: number;
    };

    /**
     * This method will determine the changes that have been made to "obj2" that distinguish it from "obj1".
     *
     * @param {Object} obj1 - The first Object to compare
     * @param {Object} obj2 - The second Object to compare
     *
     * @returns {Object[]} An Array of JSON patches
     */
    export function generateJSONPatch<T extends object>(obj1: T, obj2: T): fastjsonpatch.Patch[] {
      return R.reject<fastjsonpatch.Patch>(R.compose(R.test(/\/\$/), R.prop("path")), jsonpatch.compare(obj1, obj2));
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
     * This method will apply the supplied Array of JSON patches to the target Object provided.
     *
     * @param {Object}   target  - The target Object against which the patches should be applied
     * @param {Object[]} patches - The Array of JSON patches to apply to the target
     *
     * @returns {Object} The original target reference
     */
    export function applyJSONPatch<T extends object>(target: T, patches: fastjsonpatch.Patch[]): T {
      // Note that the jsonpatch library applies patches via reference.
      jsonpatch.apply(target, patches);

      return target;
    }

    /**
     * This method will generate an ordered list of actions to be performed against the Array, such that "arr1" will be
     * reordered to match the order of "arr2".
     *
     * @param {String[]} arr1 - The starting Array
     * @param {String[]} arr2 - The ending Array
     *
     * @returns {Object[]} An Array of reordering steps
     */
    export function generateArrayPatch(arr1: string[], arr2: string[]): ArrayPatch[] {
      const patch: ArrayPatch[] = [];
      const tracker = Array.from(arr1);

      for (let i = 0; i < arr1.length + 1; i++) {
        const largestMove = tracker.reduce((acc: number[], val: string, index: number): number[] => {
          const currentMove = [index, arr2.indexOf(val)];

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
     * @todo Document this.
     *
     * @param {String} prop - The property to use for comparison
     * @param {Any[]}  arr1 - The primary array to use as the source
     * @param {Any[]}  arr2 - The secondary array to use as the comparison
     */
    export function extractDeviantsByProp<T extends object>(prop: string, arr1: T[], arr2: T[]): T[] {
      return R.differenceWith<T>(R.eqBy(R.prop(prop)), arr1, arr2);
    }

    /**
     * @todo Document this.
     */
    export function extractIntersectionsByProp<T extends object>(prop: string, arr1: T[], arr2: T[]): T[] {
      return R.filter<T>(R.compose(R.flip(R.contains)(R.map(R.prop(prop), arr2)), R.prop(prop)), arr1);
    }

  }

}
