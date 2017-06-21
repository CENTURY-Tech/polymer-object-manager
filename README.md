<a name="Century"></a>

## Century : <code>object</code>
**Kind**: global namespace  

* [Century](#Century) : <code>object</code>
    * [.ObjectManagement](#Century.ObjectManagement) ⇐ <code>polymer.Base</code>
        * [new ObjectManagement()](#new_Century.ObjectManagement_new)
        * _instance_
            * [.target](#Century.ObjectManagement+target)
            * [.schema](#Century.ObjectManagement+schema)
            * [.sortHandlers](#Century.ObjectManagement+sortHandlers)
            * [.mergeHandlers](#Century.ObjectManagement+mergeHandlers)
            * [.original](#Century.ObjectManagement+original) ℗
            * [.validator](#Century.ObjectManagement+validator) ℗
            * [.created()](#Century.ObjectManagement+created) ⇒ <code>Void</code>
            * [.persistChanges()](#Century.ObjectManagement+persistChanges) ⇒ <code>Promise.&lt;Void&gt;</code>
            * [.resetChanges()](#Century.ObjectManagement+resetChanges) ⇒ <code>Void</code>
            * [.validateChanges()](#Century.ObjectManagement+validateChanges) ⇒ <code>Void</code>
            * [.handleTargetUpdated(diff)](#Century.ObjectManagement+handleTargetUpdated) ⇒ <code>Void</code>
            * [.handleSortHandersAssigned(sortHandlers, target)](#Century.ObjectManagement+handleSortHandersAssigned) ⇒ <code>Void</code>
            * [.handleMergeHandlersAssigned(mergeHandlers, target)](#Century.ObjectManagement+handleMergeHandlersAssigned) ⇒ <code>Void</code>
            * [.markTargetPathAsPristine(path)](#Century.ObjectManagement+markTargetPathAsPristine) ⇒ <code>Void</code> ℗
            * [.markTargetPathAsDirty(path)](#Century.ObjectManagement+markTargetPathAsDirty) ⇒ <code>Void</code> ℗
            * [.markTargetPathAsValid(path)](#Century.ObjectManagement+markTargetPathAsValid) ⇒ <code>Void</code> ℗
            * [.markTargetPathAsInvalid(path)](#Century.ObjectManagement+markTargetPathAsInvalid) ⇒ <code>Void</code> ℗
            * [.setTargetPathRoot(root, path)](#Century.ObjectManagement+setTargetPathRoot) ⇒ <code>Void</code> ℗
            * [.setTargetPathErrors(errors, path)](#Century.ObjectManagement+setTargetPathErrors) ⇒ <code>Void</code> ℗
            * [.prepareTargetRoots()](#Century.ObjectManagement+prepareTargetRoots) ⇒ <code>Void</code> ℗
            * [.processTargetErrors(errors)](#Century.ObjectManagement+processTargetErrors) ⇒ <code>Void</code> ℗
            * [.assignTargetErrorsForPath(errors, path)](#Century.ObjectManagement+assignTargetErrorsForPath) ⇒ <code>Void</code> ℗
        * _static_
            * [.isTempUUID(uuid)](#Century.ObjectManagement.isTempUUID) ⇒ <code>Boolean</code>
            * [.generateTempUUID()](#Century.ObjectManagement.generateTempUUID) ⇒ <code>String</code>
    * [.OMDiffUtils](#Century.OMDiffUtils) : <code>object</code>
        * [.generateJSONMerge(obj1, obj2)](#Century.OMDiffUtils.generateJSONMerge) ⇒ <code>Object</code>
        * [.generateArraySortByProp(prop, arr1, arr2)](#Century.OMDiffUtils.generateArraySortByProp) ⇒ <code>Array</code>
        * [.findIndexByProp(prop, arr, value)](#Century.OMDiffUtils.findIndexByProp) ⇒ <code>Number</code>
        * [.extractDeviantsByProp(prop, arr1, arr2)](#Century.OMDiffUtils.extractDeviantsByProp) ⇒ <code>Array</code>
        * [.extractIntersectionsByProp(prop, arr1, arr2)](#Century.OMDiffUtils.extractIntersectionsByProp) ⇒ <code>Array</code>
    * [.OMHandlerUtils](#Century.OMHandlerUtils) : <code>object</code>
        * [.getSearchObject(handler, scope)](#Century.OMHandlerUtils.getSearchObject) ⇒ <code>Object</code>
        * [.pickRelevantKeys(handler, value)](#Century.OMHandlerUtils.pickRelevantKeys) ⇒ <code>Object</code>
        * [.retrieveAddedLists(handler, searchObject)](#Century.OMHandlerUtils.retrieveAddedLists) ⇒ <code>Array</code>
        * [.retrieveSharedLists(handler, searchObject)](#Century.OMHandlerUtils.retrieveSharedLists) ⇒ <code>Array</code>
        * [.retrieveSharedObjects(handler, searchObject)](#Century.OMHandlerUtils.retrieveSharedObjects) ⇒ <code>Array</code>
        * [.retrieveRemovedLists(handler, searchObject)](#Century.OMHandlerUtils.retrieveRemovedLists) ⇒ <code>Array</code>
    * [.OMObjectUtils](#Century.OMObjectUtils) : <code>object</code>
        * [.deconstructObject(obj)](#Century.OMObjectUtils.deconstructObject) ⇒ <code>Array.&lt;ObjectPart&gt;</code>
        * [.walkObjectBy(obj, condition)](#Century.OMObjectUtils.walkObjectBy) ⇒ <code>Array.&lt;ObjectPart&gt;</code>
        * [.walkObjectByValueType(obj, type)](#Century.OMObjectUtils.walkObjectByValueType) ⇒ <code>Array.&lt;ObjectPart&gt;</code>
        * [.walkObjectByLookupRegex(obj, regex)](#Century.OMObjectUtils.walkObjectByLookupRegex) ⇒ <code>Array.&lt;ObjectPart&gt;</code>
        * [.ObjectPart](#Century.OMObjectUtils.ObjectPart) : <code>Array</code>
    * [.OMPathUtils](#Century.OMPathUtils) : <code>object</code>
        * [.pathToRoot(path)](#Century.OMPathUtils.pathToRoot) ⇒ <code>String</code>
        * [.pathToLookup(path)](#Century.OMPathUtils.pathToLookup) ⇒ <code>String</code>
        * [.rootToPath(root)](#Century.OMPathUtils.rootToPath) ⇒ <code>String</code>
        * [.lookupToPath(lookup)](#Century.OMPathUtils.lookupToPath) ⇒ <code>String</code>
        * [.getErrorsForRoot(errors, root, [recursive])](#Century.OMPathUtils.getErrorsForRoot) ⇒ <code>Array.&lt;Object&gt;</code>

<a name="Century.ObjectManagement"></a>

### Century.ObjectManagement ⇐ <code>polymer.Base</code>
**Kind**: static class of [<code>Century</code>](#Century)  
**Extends**: <code>polymer.Base</code>  

* [.ObjectManagement](#Century.ObjectManagement) ⇐ <code>polymer.Base</code>
    * [new ObjectManagement()](#new_Century.ObjectManagement_new)
    * _instance_
        * [.target](#Century.ObjectManagement+target)
        * [.schema](#Century.ObjectManagement+schema)
        * [.sortHandlers](#Century.ObjectManagement+sortHandlers)
        * [.mergeHandlers](#Century.ObjectManagement+mergeHandlers)
        * [.original](#Century.ObjectManagement+original) ℗
        * [.validator](#Century.ObjectManagement+validator) ℗
        * [.created()](#Century.ObjectManagement+created) ⇒ <code>Void</code>
        * [.persistChanges()](#Century.ObjectManagement+persistChanges) ⇒ <code>Promise.&lt;Void&gt;</code>
        * [.resetChanges()](#Century.ObjectManagement+resetChanges) ⇒ <code>Void</code>
        * [.validateChanges()](#Century.ObjectManagement+validateChanges) ⇒ <code>Void</code>
        * [.handleTargetUpdated(diff)](#Century.ObjectManagement+handleTargetUpdated) ⇒ <code>Void</code>
        * [.handleSortHandersAssigned(sortHandlers, target)](#Century.ObjectManagement+handleSortHandersAssigned) ⇒ <code>Void</code>
        * [.handleMergeHandlersAssigned(mergeHandlers, target)](#Century.ObjectManagement+handleMergeHandlersAssigned) ⇒ <code>Void</code>
        * [.markTargetPathAsPristine(path)](#Century.ObjectManagement+markTargetPathAsPristine) ⇒ <code>Void</code> ℗
        * [.markTargetPathAsDirty(path)](#Century.ObjectManagement+markTargetPathAsDirty) ⇒ <code>Void</code> ℗
        * [.markTargetPathAsValid(path)](#Century.ObjectManagement+markTargetPathAsValid) ⇒ <code>Void</code> ℗
        * [.markTargetPathAsInvalid(path)](#Century.ObjectManagement+markTargetPathAsInvalid) ⇒ <code>Void</code> ℗
        * [.setTargetPathRoot(root, path)](#Century.ObjectManagement+setTargetPathRoot) ⇒ <code>Void</code> ℗
        * [.setTargetPathErrors(errors, path)](#Century.ObjectManagement+setTargetPathErrors) ⇒ <code>Void</code> ℗
        * [.prepareTargetRoots()](#Century.ObjectManagement+prepareTargetRoots) ⇒ <code>Void</code> ℗
        * [.processTargetErrors(errors)](#Century.ObjectManagement+processTargetErrors) ⇒ <code>Void</code> ℗
        * [.assignTargetErrorsForPath(errors, path)](#Century.ObjectManagement+assignTargetErrorsForPath) ⇒ <code>Void</code> ℗
    * _static_
        * [.isTempUUID(uuid)](#Century.ObjectManagement.isTempUUID) ⇒ <code>Boolean</code>
        * [.generateTempUUID()](#Century.ObjectManagement.generateTempUUID) ⇒ <code>String</code>

<a name="new_Century.ObjectManagement_new"></a>

#### new ObjectManagement()
Object Management behaviour.

<a name="Century.ObjectManagement+target"></a>

#### objectManagement.target
The target Object to be managed. Upon assigning the target, a clone of the target is made and stored privately to
allow for use during change detection and resetting later on.

**Kind**: instance property of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
<a name="Century.ObjectManagement+schema"></a>

#### objectManagement.schema
The schema with which to perform any validation. This must be a valid JSON schema, and is only required to cover
keys on the target that need to be validated, any other keys will be ignored.

**Kind**: instance property of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
<a name="Century.ObjectManagement+sortHandlers"></a>

#### objectManagement.sortHandlers
An Array of sorting handlers instruct the behaviour how to handle changes in Arrays found within the target
Object.

**Kind**: instance property of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
<a name="Century.ObjectManagement+mergeHandlers"></a>

#### objectManagement.mergeHandlers
An Array of merge handlers that instruct the behaviour how to handle changes in Objects found within the target
Object.

**Kind**: instance property of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
<a name="Century.ObjectManagement+original"></a>

#### objectManagement.original ℗
A backup copy of the target.

**Kind**: instance property of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
**Access**: private  
<a name="Century.ObjectManagement+validator"></a>

#### objectManagement.validator ℗
An instance of the ZSchema class, used for validation purposes.

**Kind**: instance property of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
**Access**: private  
<a name="Century.ObjectManagement+created"></a>

#### objectManagement.created() ⇒ <code>Void</code>
This lifecycle method is used as a constructor, as constructors are not called on Behaviours. This limitation
prevents us from initialising the required private variables within the declaration of the class properties when
transpiling down to ES5. Because Typescript + Polymer = A big bag of fun...

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
<a name="Century.ObjectManagement+persistChanges"></a>

#### objectManagement.persistChanges() ⇒ <code>Promise.&lt;Void&gt;</code>
This method calculates the changes made to the target Object, and then parses those changes according handlers
that should have previously been assigned, if no handlers are found, then the method will resolve immediately.

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
<a name="Century.ObjectManagement+resetChanges"></a>

#### objectManagement.resetChanges() ⇒ <code>Void</code>
This method will reset the target Object to it's original state.

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
<a name="Century.ObjectManagement+validateChanges"></a>

#### objectManagement.validateChanges() ⇒ <code>Void</code>
This method will validate the target Object against the provided schema, if available. After validating the
target Object, any errors generated during the validation process will be processed.

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
<a name="Century.ObjectManagement+handleTargetUpdated"></a>

#### objectManagement.handleTargetUpdated(diff) ⇒ <code>Void</code>
This method will handle any updates made to the target Object. If the Object is being set, a clone will be made
and referenced for later usage. If however, Object is being updated, it is marked as dirty, and then validated.

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  

| Param | Type | Description |
| --- | --- | --- |
| diff | <code>Object</code> | A Polymer diff Object |

<a name="Century.ObjectManagement+handleSortHandersAssigned"></a>

#### objectManagement.handleSortHandersAssigned(sortHandlers, target) ⇒ <code>Void</code>
This method will validate each of the sort handlers, and in the event that a handler is seen to be incorrectly
setup for the current target Object, it will be marked as invalid.

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  

| Param | Type | Description |
| --- | --- | --- |
| sortHandlers | <code>Array.&lt;Object&gt;</code> | An Array of sort handlers |
| target | <code>Object</code> | The target Object |

<a name="Century.ObjectManagement+handleMergeHandlersAssigned"></a>

#### objectManagement.handleMergeHandlersAssigned(mergeHandlers, target) ⇒ <code>Void</code>
This method will validate each of the merge handlers, and in the event that a handler is seen to be incorrectly
setup for the current target Object, it will be marked as invalid.

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  

| Param | Type | Description |
| --- | --- | --- |
| mergeHandlers | <code>Array.&lt;Object&gt;</code> | An Array of merge handlers |
| target | <code>Object</code> | The target Object |

<a name="Century.ObjectManagement+markTargetPathAsPristine"></a>

#### objectManagement.markTargetPathAsPristine(path) ⇒ <code>Void</code> ℗
This method will mark the Object at the lookup path provided as pristine (that is untouched). This will falsify
the "$dirty" flag at the lookup path specified on the target and make the "$pristine" flag truthy.

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>Array.&lt;String&gt;</code> | An Array of Object keys forming a lookup path |

<a name="Century.ObjectManagement+markTargetPathAsDirty"></a>

#### objectManagement.markTargetPathAsDirty(path) ⇒ <code>Void</code> ℗
This method will mark the Object at the lookup path provided as as dirty (that it has had changes made). This
will falsify the "$pristine" flag at the lookup path specified on the target and make the "$dirty" flag truthy.

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>Array.&lt;String&gt;</code> | An Array of Object keys forming a lookup path |

<a name="Century.ObjectManagement+markTargetPathAsValid"></a>

#### objectManagement.markTargetPathAsValid(path) ⇒ <code>Void</code> ℗
This method will mark the Object at the lookup path provided as valid. This will falsify the "$invalid" flag, and
make the "$valid" flag truthy.

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>Array.&lt;String&gt;</code> | An Array of Object keys forming a lookup path |

<a name="Century.ObjectManagement+markTargetPathAsInvalid"></a>

#### objectManagement.markTargetPathAsInvalid(path) ⇒ <code>Void</code> ℗
This method will mark the Object at the lookup path provided as invalid. This will falsify the "$valid" flag, and
make the "$invalid" flag truthy.

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>Array.&lt;String&gt;</code> | An Array of Object keys forming a lookup path |

<a name="Century.ObjectManagement+setTargetPathRoot"></a>

#### objectManagement.setTargetPathRoot(root, path) ⇒ <code>Void</code> ℗
This method will assign the provided root to a key named "$root" on the target Object at the lookup path
provided.

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| root | <code>String</code> | The root to be set at the lookup path provided |
| path | <code>Array.&lt;String&gt;</code> | An Array of Object keys forming a lookup path |

<a name="Century.ObjectManagement+setTargetPathErrors"></a>

#### objectManagement.setTargetPathErrors(errors, path) ⇒ <code>Void</code> ℗
This method will assign the provided errors to a key named "$errors" on the target Object at the lookup path
provided.

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| errors | <code>Array.&lt;Object&gt;</code> | The errors to be set at the lookup path provided |
| path | <code>Array.&lt;String&gt;</code> | An Array of Object keys forming a lookup path |

<a name="Century.ObjectManagement+prepareTargetRoots"></a>

#### objectManagement.prepareTargetRoots() ⇒ <code>Void</code> ℗
This method will initialise the root path for every Object in the target Object.

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
**Access**: private  
<a name="Century.ObjectManagement+processTargetErrors"></a>

#### objectManagement.processTargetErrors(errors) ⇒ <code>Void</code> ℗
This method will populate the errors provided throughout the target Object.

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| errors | <code>Array.&lt;Object&gt;</code> | The errors to be populated throughout the target Object |

<a name="Century.ObjectManagement+assignTargetErrorsForPath"></a>

#### objectManagement.assignTargetErrorsForPath(errors, path) ⇒ <code>Void</code> ℗
This method will assign the errors provided to the target Object at the lookup path provided, and will then
proceed to update the validity signature of the Object at the lookup path provided.

**Kind**: instance method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| errors | <code>Array.&lt;Object&gt;</code> | The errors to be populated throughout the target Object |
| path | <code>Array.&lt;String&gt;</code> | An Array of Object keys forming a lookup path |

<a name="Century.ObjectManagement.isTempUUID"></a>

#### ObjectManagement.isTempUUID(uuid) ⇒ <code>Boolean</code>
The method will check to see if the UUID provided has been generated on the client, and is there temporary.

**Kind**: static method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
**Returns**: <code>Boolean</code> - Whether or not the UUID is temporary  

| Param | Type | Description |
| --- | --- | --- |
| uuid | <code>String</code> | The unique ID to be checked |

<a name="Century.ObjectManagement.generateTempUUID"></a>

#### ObjectManagement.generateTempUUID() ⇒ <code>String</code>
This method will generate a unique ID to act as a placeholder for newly created Strands and Nuggets.

**Kind**: static method of [<code>ObjectManagement</code>](#Century.ObjectManagement)  
**Returns**: <code>String</code> - A unique ID  
<a name="Century.OMDiffUtils"></a>

### Century.OMDiffUtils : <code>object</code>
**Kind**: static namespace of [<code>Century</code>](#Century)  

* [.OMDiffUtils](#Century.OMDiffUtils) : <code>object</code>
    * [.generateJSONMerge(obj1, obj2)](#Century.OMDiffUtils.generateJSONMerge) ⇒ <code>Object</code>
    * [.generateArraySortByProp(prop, arr1, arr2)](#Century.OMDiffUtils.generateArraySortByProp) ⇒ <code>Array</code>
    * [.findIndexByProp(prop, arr, value)](#Century.OMDiffUtils.findIndexByProp) ⇒ <code>Number</code>
    * [.extractDeviantsByProp(prop, arr1, arr2)](#Century.OMDiffUtils.extractDeviantsByProp) ⇒ <code>Array</code>
    * [.extractIntersectionsByProp(prop, arr1, arr2)](#Century.OMDiffUtils.extractIntersectionsByProp) ⇒ <code>Array</code>

<a name="Century.OMDiffUtils.generateJSONMerge"></a>

#### OMDiffUtils.generateJSONMerge(obj1, obj2) ⇒ <code>Object</code>
This method will determine the changes that have been made to "obj2" that distinguish it from "obj1".

**Kind**: static method of [<code>OMDiffUtils</code>](#Century.OMDiffUtils)  
**Returns**: <code>Object</code> - A JSON merge Object  

| Param | Type | Description |
| --- | --- | --- |
| obj1 | <code>Object</code> | The first Object to compare |
| obj2 | <code>Object</code> | The second Object to compare |

<a name="Century.OMDiffUtils.generateArraySortByProp"></a>

#### OMDiffUtils.generateArraySortByProp(prop, arr1, arr2) ⇒ <code>Array</code>
This method will determine a list of insertions in the simplest way possible, however, the number of insertions
is not the smallest number, as the list of actions can be N+1 in length, where N = Array.length (the smallest
number of insertions would be N-1).

**Kind**: static method of [<code>OMDiffUtils</code>](#Century.OMDiffUtils)  
**Returns**: <code>Array</code> - An ordered Array of insertions  

| Param | Type | Description |
| --- | --- | --- |
| prop | <code>String</code> | The property to inspect by |
| arr1 | <code>Array</code> | The first Array to inspect |
| arr2 | <code>Array</code> | The second Array to inspect |

<a name="Century.OMDiffUtils.findIndexByProp"></a>

#### OMDiffUtils.findIndexByProp(prop, arr, value) ⇒ <code>Number</code>
This method will find and return the index of the value in the Array that shares the property value of the
provided key.

**Kind**: static method of [<code>OMDiffUtils</code>](#Century.OMDiffUtils)  
**Returns**: <code>Number</code> - The index of the Object provided in the Array provided  

| Param | Type | Description |
| --- | --- | --- |
| prop | <code>String</code> | The property to inspect by |
| arr | <code>Array</code> | The Array to inspect |
| value | <code>Object</code> | The value to search for |

<a name="Century.OMDiffUtils.extractDeviantsByProp"></a>

#### OMDiffUtils.extractDeviantsByProp(prop, arr1, arr2) ⇒ <code>Array</code>
This method will extract an Array of items that only appear in the first liArrayst.

**Kind**: static method of [<code>OMDiffUtils</code>](#Century.OMDiffUtils)  
**Returns**: <code>Array</code> - An Array of items that only appear in the first Array  

| Param | Type | Description |
| --- | --- | --- |
| prop | <code>String</code> | The property to inspect by |
| arr1 | <code>Array</code> | The first Array to inspect |
| arr2 | <code>Array</code> | The second Array to inspect |

<a name="Century.OMDiffUtils.extractIntersectionsByProp"></a>

#### OMDiffUtils.extractIntersectionsByProp(prop, arr1, arr2) ⇒ <code>Array</code>
This method will extract an Array of items from the first Array that also appear in the second Array.

**Kind**: static method of [<code>OMDiffUtils</code>](#Century.OMDiffUtils)  
**Returns**: <code>Array</code> - An Array of items from the first Array that also appear in the second Array  

| Param | Type | Description |
| --- | --- | --- |
| prop | <code>String</code> | The property to inspect by |
| arr1 | <code>Array</code> | The first Array to inspect |
| arr2 | <code>Array</code> | The second Array to inspect |

<a name="Century.OMHandlerUtils"></a>

### Century.OMHandlerUtils : <code>object</code>
**Kind**: static namespace of [<code>Century</code>](#Century)  

* [.OMHandlerUtils](#Century.OMHandlerUtils) : <code>object</code>
    * [.getSearchObject(handler, scope)](#Century.OMHandlerUtils.getSearchObject) ⇒ <code>Object</code>
    * [.pickRelevantKeys(handler, value)](#Century.OMHandlerUtils.pickRelevantKeys) ⇒ <code>Object</code>
    * [.retrieveAddedLists(handler, searchObject)](#Century.OMHandlerUtils.retrieveAddedLists) ⇒ <code>Array</code>
    * [.retrieveSharedLists(handler, searchObject)](#Century.OMHandlerUtils.retrieveSharedLists) ⇒ <code>Array</code>
    * [.retrieveSharedObjects(handler, searchObject)](#Century.OMHandlerUtils.retrieveSharedObjects) ⇒ <code>Array</code>
    * [.retrieveRemovedLists(handler, searchObject)](#Century.OMHandlerUtils.retrieveRemovedLists) ⇒ <code>Array</code>

<a name="Century.OMHandlerUtils.getSearchObject"></a>

#### OMHandlerUtils.getSearchObject(handler, scope) ⇒ <code>Object</code>
This method will walk the "target" and "original" Objects provided in the search scope for values who's lookups
satisfy the search expression on the provided handler, and return a search Object containing both the provided
scope and the search results. Note that the initial scope is kept for later reference.

**Kind**: static method of [<code>OMHandlerUtils</code>](#Century.OMHandlerUtils)  
**Returns**: <code>Object</code> - An Object holding the search scope and search results  

| Param | Type | Description |
| --- | --- | --- |
| handler | <code>Object</code> | The handler to be used |
| scope | <code>Object</code> | The scope of the search |

<a name="Century.OMHandlerUtils.pickRelevantKeys"></a>

#### OMHandlerUtils.pickRelevantKeys(handler, value) ⇒ <code>Object</code>
This method will filter the Object provided according to the keys defined in the handler.

**Kind**: static method of [<code>OMHandlerUtils</code>](#Century.OMHandlerUtils)  
**Returns**: <code>Object</code> - A filtered copy of the Object provided  

| Param | Type | Description |
| --- | --- | --- |
| handler | <code>Object</code> | The handler to be used |
| value | <code>Object</code> | The Object to filter |

<a name="Century.OMHandlerUtils.retrieveAddedLists"></a>

#### OMHandlerUtils.retrieveAddedLists(handler, searchObject) ⇒ <code>Array</code>
This method will retrieve the Array of Object parts from the search results that exist on the target, but not the
original.

**Kind**: static method of [<code>OMHandlerUtils</code>](#Century.OMHandlerUtils)  
**Returns**: <code>Array</code> - An Array of Object parts that exist on the target but not the original  

| Param | Type | Description |
| --- | --- | --- |
| handler | <code>Object</code> | The handler to be used |
| searchObject | <code>Object</code> | An Object holding the search scope and search results |

<a name="Century.OMHandlerUtils.retrieveSharedLists"></a>

#### OMHandlerUtils.retrieveSharedLists(handler, searchObject) ⇒ <code>Array</code>
This method will retrieve the Array of Object parts in the search results that exist on both the target and the
original. Note that this method specifically handles sort handlers.

**Kind**: static method of [<code>OMHandlerUtils</code>](#Century.OMHandlerUtils)  
**Returns**: <code>Array</code> - An Array of Object parts that exist on both the target and original  

| Param | Type | Description |
| --- | --- | --- |
| handler | <code>Object</code> | The handler to be used |
| searchObject | <code>Object</code> | An Object holding the search scope and search results |

<a name="Century.OMHandlerUtils.retrieveSharedObjects"></a>

#### OMHandlerUtils.retrieveSharedObjects(handler, searchObject) ⇒ <code>Array</code>
This method will retrieve the Array of Object parts in the search results that exist on both the target and the
original. Note that this method specifically handles merge handlers.

**Kind**: static method of [<code>OMHandlerUtils</code>](#Century.OMHandlerUtils)  
**Returns**: <code>Array</code> - An Array of Object parts that exist on both the target and original  

| Param | Type | Description |
| --- | --- | --- |
| handler | <code>Object</code> | The handler to be used |
| searchObject | <code>Object</code> | An Object holding the search scope and search results |

<a name="Century.OMHandlerUtils.retrieveRemovedLists"></a>

#### OMHandlerUtils.retrieveRemovedLists(handler, searchObject) ⇒ <code>Array</code>
This method will retrieve the Array of Object parts in the search results that do not exist on the target, but do
exist on the original.

**Kind**: static method of [<code>OMHandlerUtils</code>](#Century.OMHandlerUtils)  
**Returns**: <code>Array</code> - An Array of Object parts that do not exist on the target but do exist on the original  

| Param | Type | Description |
| --- | --- | --- |
| handler | <code>Object</code> | The handler to be used |
| searchObject | <code>Object</code> | An Object holding the search scope and search results |

<a name="Century.OMObjectUtils"></a>

### Century.OMObjectUtils : <code>object</code>
**Kind**: static namespace of [<code>Century</code>](#Century)  

* [.OMObjectUtils](#Century.OMObjectUtils) : <code>object</code>
    * [.deconstructObject(obj)](#Century.OMObjectUtils.deconstructObject) ⇒ <code>Array.&lt;ObjectPart&gt;</code>
    * [.walkObjectBy(obj, condition)](#Century.OMObjectUtils.walkObjectBy) ⇒ <code>Array.&lt;ObjectPart&gt;</code>
    * [.walkObjectByValueType(obj, type)](#Century.OMObjectUtils.walkObjectByValueType) ⇒ <code>Array.&lt;ObjectPart&gt;</code>
    * [.walkObjectByLookupRegex(obj, regex)](#Century.OMObjectUtils.walkObjectByLookupRegex) ⇒ <code>Array.&lt;ObjectPart&gt;</code>
    * [.ObjectPart](#Century.OMObjectUtils.ObjectPart) : <code>Array</code>

<a name="Century.OMObjectUtils.deconstructObject"></a>

#### OMObjectUtils.deconstructObject(obj) ⇒ <code>Array.&lt;ObjectPart&gt;</code>
This method breaks down the provided Object into it's constituent parts and returns an Array of Arrays, where
each Subarray contains a lookup string at the zeroth index, and a reference to the value held at that lookup
string in the first index.

**Kind**: static method of [<code>OMObjectUtils</code>](#Century.OMObjectUtils)  
**Returns**: <code>Array.&lt;ObjectPart&gt;</code> - An Array of the Object's constituent parts  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The Object to be deconstructed |

<a name="Century.OMObjectUtils.walkObjectBy"></a>

#### OMObjectUtils.walkObjectBy(obj, condition) ⇒ <code>Array.&lt;ObjectPart&gt;</code>
This method will search through the provided Object for values that satisfy the provided condition. It will then
return an Array of Arrays, where each Subarray contians a lookup string to the match at the zeroth index, and
then a reference to the match in the first index.

**Kind**: static method of [<code>OMObjectUtils</code>](#Century.OMObjectUtils)  
**Returns**: <code>Array.&lt;ObjectPart&gt;</code> - An Array of matches found in the Object that satisfy the provided condition  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The Object to be searched |
| condition | <code>function</code> | A condition to be met to be included in the output |

<a name="Century.OMObjectUtils.walkObjectByValueType"></a>

#### OMObjectUtils.walkObjectByValueType(obj, type) ⇒ <code>Array.&lt;ObjectPart&gt;</code>
This method will search through the provided Object for values that match the provided type. It will then return
an Array of Arrays, where each Subarray contians a lookup string to the match at the zeroth index, and then a
reference to the match in the first index.

**Kind**: static method of [<code>OMObjectUtils</code>](#Century.OMObjectUtils)  
**Returns**: <code>Array.&lt;ObjectPart&gt;</code> - An Array of matches found in the Object for the specified type  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The Object to be searched |
| type | <code>Object</code> | The type to search for |

<a name="Century.OMObjectUtils.walkObjectByLookupRegex"></a>

#### OMObjectUtils.walkObjectByLookupRegex(obj, regex) ⇒ <code>Array.&lt;ObjectPart&gt;</code>
This method will search through the provided Object for lookups that match the provided Regular Expression. It
will then return an Array of Arrays, where each Subarray contians a lookup string to the match at the zeroth
index, and then a reference to the match in the first index.

**Kind**: static method of [<code>OMObjectUtils</code>](#Century.OMObjectUtils)  
**Returns**: <code>Array.&lt;ObjectPart&gt;</code> - An Array of matches found in the Object with lookups that pass the Regular Expression  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The Object to be searched |
| regex | <code>RegExp</code> | The Regular Expression to search by |

<a name="Century.OMObjectUtils.ObjectPart"></a>

#### OMObjectUtils.ObjectPart : <code>Array</code>
A mixed Array containing values at the zeroth and first indexes. The zeroth index contains a lookup path to a
value in the targeted Object, and the first index contains a reference to that value, unless the value is neither
an Object nor Array, when it would therefore be a value.

**Kind**: static typedef of [<code>OMObjectUtils</code>](#Century.OMObjectUtils)  
<a name="Century.OMPathUtils"></a>

### Century.OMPathUtils : <code>object</code>
**Kind**: static namespace of [<code>Century</code>](#Century)  

* [.OMPathUtils](#Century.OMPathUtils) : <code>object</code>
    * [.pathToRoot(path)](#Century.OMPathUtils.pathToRoot) ⇒ <code>String</code>
    * [.pathToLookup(path)](#Century.OMPathUtils.pathToLookup) ⇒ <code>String</code>
    * [.rootToPath(root)](#Century.OMPathUtils.rootToPath) ⇒ <code>String</code>
    * [.lookupToPath(lookup)](#Century.OMPathUtils.lookupToPath) ⇒ <code>String</code>
    * [.getErrorsForRoot(errors, root, [recursive])](#Century.OMPathUtils.getErrorsForRoot) ⇒ <code>Array.&lt;Object&gt;</code>

<a name="Century.OMPathUtils.pathToRoot"></a>

#### OMPathUtils.pathToRoot(path) ⇒ <code>String</code>
This method will generate a root string from the lookup path provided.

**Kind**: static method of [<code>OMPathUtils</code>](#Century.OMPathUtils)  
**Returns**: <code>String</code> - A root built from the lookup path provided  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>Array.&lt;String&gt;</code> | An Array of Object keys forming a lookup path |

<a name="Century.OMPathUtils.pathToLookup"></a>

#### OMPathUtils.pathToLookup(path) ⇒ <code>String</code>
This method will generate a single lookup string from the lookup path provided.

**Kind**: static method of [<code>OMPathUtils</code>](#Century.OMPathUtils)  
**Returns**: <code>String</code> - A single lookup string built from the lookup path provided  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>Array.&lt;String&gt;</code> | An Array of Object keys forming a lookup path |

<a name="Century.OMPathUtils.rootToPath"></a>

#### OMPathUtils.rootToPath(root) ⇒ <code>String</code>
This method will generate an Array of Object keys from the root string provided.

**Kind**: static method of [<code>OMPathUtils</code>](#Century.OMPathUtils)  
**Returns**: <code>String</code> - An Array of Object keys forming a lookup path  

| Param | Type | Description |
| --- | --- | --- |
| root | <code>String</code> | A single root string |

<a name="Century.OMPathUtils.lookupToPath"></a>

#### OMPathUtils.lookupToPath(lookup) ⇒ <code>String</code>
This method will generate an Array of Object keys from the lookup string provided.

**Kind**: static method of [<code>OMPathUtils</code>](#Century.OMPathUtils)  
**Returns**: <code>String</code> - An Array of Object keys forming a lookup path  

| Param | Type | Description |
| --- | --- | --- |
| lookup | <code>String</code> | A single lookup string |

<a name="Century.OMPathUtils.getErrorsForRoot"></a>

#### OMPathUtils.getErrorsForRoot(errors, root, [recursive]) ⇒ <code>Array.&lt;Object&gt;</code>
Retrieve the errors from the Array of errors provided that stem from the "root" provided.

**Kind**: static method of [<code>OMPathUtils</code>](#Century.OMPathUtils)  
**Returns**: <code>Array.&lt;Object&gt;</code> - An Array of errors stemming from the root provided  

| Param | Type | Description |
| --- | --- | --- |
| errors | <code>Array.&lt;Object&gt;</code> | The Array of validation errors |
| root | <code>String</code> | The root to filter by |
| [recursive] | <code>Boolean</code> | Whether or not the filtered results should be recursively retrieved |

