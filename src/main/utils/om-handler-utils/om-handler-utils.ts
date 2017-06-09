namespace Century {

  export namespace OMHandlerUtils {

    interface Handler {
      search: RegExp;
      invalid?: boolean;
      observe?: string[];
      ignore?: string[];
      handler: (action: HandlerEvent, lookup: string, value: any) => Promise<void>;
    }

    export type HandlerEvent = "addition" | "removal" | "move" | "update" | "inherited-addition" | "inherited-removal";

    export interface SortHandler extends Handler {
      itemSignature: string;
      parentSignature: string;
    }

    export interface MergeHandler extends Handler {
      objectSignature: string;
    }

    export interface SearchObject {
      scope: SearchScope;
      results: SearchResults;
    };

    export type SearchScope = {[index in "target" | "original"]: object; };
    export type SearchResults = {[index in "target" | "original"]: OMObjectUtils.ObjectPart[]; };
    export type MatchedResults = {[index in "target" | "original"]?: OMObjectUtils.ObjectPart};

    export function getSearchObject(handler: Handler, scope: SearchScope): SearchObject {
      const results = {
        target: OMObjectUtils.walkObjectByLookupRegex(scope.target, handler.search),
        original: OMObjectUtils.walkObjectByLookupRegex(scope.original, handler.search)
      };

      return { scope, results };
    };

    export function getRelevantKeys(handler: Handler, value: any): any {
      value = handler.observe ? R.pick(handler.observe, value) : value;
      value = handler.ignore ? R.omit(handler.ignore, value) : value;

      return value;
    }

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

    export function retrieveSharedObjects(handler: MergeHandler, searchObject: SearchObject): MatchedResults[] {
      const matchedResults: MatchedResults[] = [];

      for (const target of searchObject.results.target) {
        const targetPath = OMPathUtils.lookupToPath(target[0]);
        const targetItem = R.path(targetPath, searchObject.scope.target);

        for (const original of searchObject.results.original) {
          const originalPath = OMPathUtils.lookupToPath(original[0]);
          const originaItem = R.path(originalPath, searchObject.scope.original);

          if (originaItem[handler.objectSignature] === targetItem[handler.objectSignature]) {
            matchedResults.push({ target, original });
            break;
          }
        }
      }

      return matchedResults;
    }

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
