namespace Century {

  /**
   * @namespace Century.OMHandlerUtils
   */
  export namespace OMHandlerUtils {

    export interface Handler<T = any> {
      search: RegExp;
      invalid?: boolean;
      observe?: string[];
      ignore?: string[];
      handler: (action: HandlerEvent, lookup: string, value: any, metadata: T) => Promise<void>;
    }

    export interface SortHandler extends Handler<SortMetadata> {
      itemSignature: string;
      parentSignature: string;
    }

    export interface SortMetadata {
      ref: any;
      toIndex?: number;
      fromIndex?: number;
    }

    export interface MergeHandler extends Handler<MergeMetadata> {
      objectSignature: string;
    }

    export interface MergeMetadata {
      targetRef: any;
      originalRef: any;
    }

    export type HandlerEvent = "addition" | "removal" | "move" | "update" | "inherited-addition" | "inherited-removal";

    export interface SearchObject {
      scope: SearchScope;
      results: SearchResults;
    }

    export type SearchScope = {[index in "target" | "original"]: object; };
    export type SearchResults = {[index in "target" | "original"]: OMObjectUtils.ObjectPart[]; };
    export type MatchedResults = {[index in "target" | "original"]?: OMObjectUtils.ObjectPart};

    /**
     * This method will walk the "target" and "original" Objects provided in the search scope for values who's lookups
     * satisfy the search expression on the provided handler, and return a search Object containing both the provided
     * scope and the search results. Note that the initial scope is kept for later reference.
     *
     * @memberof Century.OMHandlerUtils
     * @function getSearchObject
     *
     * @param {Object} handler - The handler to be used
     * @param {Object} scope   - The scope of the search
     *
     * @returns {Object} An Object holding the search scope and search results
     */
    export function getSearchObject(handler: Handler, scope: SearchScope): SearchObject {
      const results = {
        target: OMObjectUtils.walkObjectByLookupRegex(scope.target, handler.search),
        original: OMObjectUtils.walkObjectByLookupRegex(scope.original, handler.search)
      };

      return { scope, results };
    }

    /**
     * This method will filter the Object provided according to the keys defined in the handler.
     *
     * @memberof Century.OMHandlerUtils
     * @function pickRelevantKeys
     *
     * @param {Object} handler - The handler to be used
     * @param {Object} value   - The Object to filter
     *
     * @returns {Object} A filtered copy of the Object provided
     */
    export function pickRelevantKeys(handler: Handler, value: object): object {
      value = handler.observe ? R.pick(handler.observe, value) : value;
      value = handler.ignore ? R.omit(handler.ignore, value) : value;

      return value;
    }

    /**
     * This method will retrieve the Array of Object parts from the search results that exist on the target, but not the
     * original.
     *
     * @memberof Century.OMHandlerUtils
     * @function retrieveAddedLists
     *
     * @param {Object} handler      - The handler to be used
     * @param {Object} searchObject - An Object holding the search scope and search results
     *
     * @returns {Array} An Array of Object parts that exist on the target but not the original
     */
    export function retrieveAddedLists(handler: SortHandler, searchObject: SearchObject): MatchedResults[] {
      const matchedResults: MatchedResults[] = [];

      for (const target of searchObject.results.target) {
        const targetPath = OMPathUtils.lookupToPath(target[0]);
        const targetParent = R.path(R.init(targetPath), searchObject.scope.target);

        if (searchObject.results.original.every((original) => {
          const originalPath = OMPathUtils.lookupToPath(original[0]);
          const originalParent = R.path(R.init(originalPath), searchObject.scope.original);

          return originalParent[handler.parentSignature] !== targetParent[handler.parentSignature];
        })) {
          matchedResults.push({ target });
        }
      }

      return matchedResults;
    }

    /**
     * This method will retrieve the Array of Object parts in the search results that exist on both the target and the
     * original. Note that this method specifically handles sort handlers.
     *
     * @memberof Century.OMHandlerUtils
     * @function retrieveSharedLists
     *
     * @param {Object} handler      - The handler to be used
     * @param {Object} searchObject - An Object holding the search scope and search results
     *
     * @returns {Array} An Array of Object parts that exist on both the target and original
     */
    export function retrieveSharedLists(handler: SortHandler, searchObject: SearchObject): MatchedResults[] {
      const matchedResults: MatchedResults[] = [];

      for (const target of searchObject.results.target) {
        const targetPath = OMPathUtils.lookupToPath(target[0]);
        const targetParent = R.path(R.init(targetPath), searchObject.scope.target);

        for (const original of searchObject.results.original) {
          const originalPath = OMPathUtils.lookupToPath(original[0]);
          const originalParent = R.path(R.init(originalPath), searchObject.scope.original);

          if (originalParent[handler.parentSignature] === targetParent[handler.parentSignature]) {
            matchedResults.push({ target, original });
            break;
          }
        }
      }

      return matchedResults;
    }

    /**
     * This method will retrieve the Array of Object parts in the search results that exist on both the target and the
     * original. Note that this method specifically handles merge handlers.
     *
     * @memberof Century.OMHandlerUtils
     * @function retrieveSharedObjects
     *
     * @param {Object} handler      - The handler to be used
     * @param {Object} searchObject - An Object holding the search scope and search results
     *
     * @returns {Array} An Array of Object parts that exist on both the target and original
     */
    export function retrieveSharedObjects(handler: MergeHandler, searchObject: SearchObject): MatchedResults[] {
      const matchedResults: MatchedResults[] = [];

      for (const target of searchObject.results.target) {
        const targetPath = OMPathUtils.lookupToPath(target[0]);
        const targetObject = R.path(targetPath, searchObject.scope.target);

        for (const original of searchObject.results.original) {
          const originalPath = OMPathUtils.lookupToPath(original[0]);
          const originalObject = R.path(originalPath, searchObject.scope.original);

          if (originalObject[handler.objectSignature] === targetObject[handler.objectSignature]) {
            matchedResults.push({ target, original });
            break;
          }
        }
      }

      return matchedResults;
    }

    /**
     * This method will retrieve the Array of Object parts in the search results that do not exist on the target, but do
     * exist on the original.
     *
     * @memberof Century.OMHandlerUtils
     * @function retrieveRemovedLists
     *
     * @param {Object} handler      - The handler to be used
     * @param {Object} searchObject - An Object holding the search scope and search results
     *
     * @returns {Array} An Array of Object parts that do not exist on the target but do exist on the original
     */
    export function retrieveRemovedLists(handler: SortHandler, searchObject: SearchObject): MatchedResults[] {
      const matchedResults: MatchedResults[] = [];

      for (const original of searchObject.results.original) {
        const originalPath = OMPathUtils.lookupToPath(original[0]);
        const originalParent = R.path(R.init(originalPath), searchObject.scope.original);

        if (searchObject.results.target.every((target) => {
          const targetPath = OMPathUtils.lookupToPath(target[0]);
          const targetParent = R.path(R.init(targetPath), searchObject.scope.target);

          return targetParent[handler.parentSignature] !== originalParent[handler.parentSignature];
        })) {
          matchedResults.push({ original });
        }
      }

      return matchedResults;
    }

  }

}
