namespace Century {

  suite("namespace: 'OMPathUtils'", (): void => {

    const OMPathUtils: any = Century["OMPathUtils"];

    /**
     * Tests for "pathToRoot".
     */
    suite("method: 'pathToRoot'", (): void => {
      test("should return the expected root string for the path provided [pass 1]", (): void => {
        assert.equal(OMPathUtils.pathToRoot([]), "#/");
      });

      test("should return the expected root string for the path provided [pass 2]", (): void => {
        assert.equal(OMPathUtils.pathToRoot(["foo"]), "#/foo");
      });

      test("should return the expected root string for the path provided [pass 3]", (): void => {
        assert.equal(OMPathUtils.pathToRoot(["foo", "bar"]), "#/foo/bar");
      });
    });

    /**
     * Tests for "pathToLookup".
     */
    suite("method: 'pathToLookup'", (): void => {
      test("should return the expected lookup string for the path provided [pass 1]", (): void => {
        assert.equal(OMPathUtils.pathToLookup([]), "");
      });

      test("should return the expected lookup string for the path provided [pass 2]", (): void => {
        assert.equal(OMPathUtils.pathToLookup(["foo"]), "foo");
      });

      test("should return the expected lookup string for the path provided [pass 3]", (): void => {
        assert.equal(OMPathUtils.pathToLookup(["foo", "bar"]), "foo.bar");
      });
    });

    /**
     * Tests for "lookupToPath".
     */
    suite("method: 'lookupToPath'", (): void => {
      test("should return the expected Object keys for the lookup string provided [pass 1]", (): void => {
        assert.deepEqual(OMPathUtils.lookupToPath(""), []);
      });

      test("should return the expected Object keys for the lookup string provided [pass 2]", (): void => {
        assert.deepEqual(OMPathUtils.lookupToPath("foo"), ["foo"]);
      });

      test("should return the expected Object keys for the lookup string provided [pass 3]", (): void => {
        assert.deepEqual(OMPathUtils.lookupToPath("foo.bar"), ["foo", "bar"]);
      });
    });

    /**
     * Tests for "getErrorsForRoot".
     */
    suite("method: 'getErrorsForRoot'", (): void => {
      test("should filter the errors provided by the root provided [pass 1]", (): void => {
        assert.deepEqual(OMPathUtils.getErrorsForRoot(mockErrors, "#/"), [mockErrors[0]]);
      });

      test("should filter the errors provided by the root provided [pass 2]", (): void => {
        assert.deepEqual(OMPathUtils.getErrorsForRoot(mockErrors, "#/b"), [mockErrors[2]]);
      });

      test("should recursively filter the errors provided by the root provided [pass 1]", (): void => {
        assert.deepEqual(OMPathUtils.getErrorsForRoot(mockErrors, "#/", true), mockErrors);
      });

      test("should recursively filter the errors provided by the root provided [pass 2]", (): void => {
        assert.deepEqual(OMPathUtils.getErrorsForRoot(mockErrors, "#/a", true), [mockErrors[1], mockErrors[3]]);
      });
    });

  });

}
