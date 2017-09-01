namespace Century {

  suite("namespace: 'PathUtils'", (): void => {

    const PathUtils = (Century as any).PathUtils;

    /**
     * Tests for "pathToRoot".
     */
    suite("method: 'pathToRoot'", (): void => {
      test("should return the expected root string for the path provided [pass 1]", (): void => {
        assert.equal(PathUtils.pathToRoot([]), "#/");
      });

      test("should return the expected root string for the path provided [pass 2]", (): void => {
        assert.equal(PathUtils.pathToRoot(["foo"]), "#/foo");
      });

      test("should return the expected root string for the path provided [pass 3]", (): void => {
        assert.equal(PathUtils.pathToRoot(["foo", "bar"]), "#/foo/bar");
      });
    });

    /**
     * Tests for "pathToLookup".
     */
    suite("method: 'pathToLookup'", (): void => {
      test("should return the expected lookup string for the path provided [pass 1]", (): void => {
        assert.equal(PathUtils.pathToLookup([]), "");
      });

      test("should return the expected lookup string for the path provided [pass 2]", (): void => {
        assert.equal(PathUtils.pathToLookup(["foo"]), "foo");
      });

      test("should return the expected lookup string for the path provided [pass 3]", (): void => {
        assert.equal(PathUtils.pathToLookup(["foo", "bar"]), "foo.bar");
      });
    });

    /**
     * Tests for "lookupToPath".
     */
    suite("method: 'lookupToPath'", (): void => {
      test("should return the expected Object keys for the lookup string provided [pass 1]", (): void => {
        assert.deepEqual(PathUtils.lookupToPath(""), []);
      });

      test("should return the expected Object keys for the lookup string provided [pass 2]", (): void => {
        assert.deepEqual(PathUtils.lookupToPath("foo"), ["foo"]);
      });

      test("should return the expected Object keys for the lookup string provided [pass 3]", (): void => {
        assert.deepEqual(PathUtils.lookupToPath("foo.bar"), ["foo", "bar"]);
      });
    });

    /**
     * Tests for "getErrorsForRoot".
     */
    suite("method: 'getErrorsForRoot'", (): void => {
      test("should filter the errors provided by the root provided [pass 1]", (): void => {
        assert.deepEqual(PathUtils.getErrorsForRoot(mockErrors, "#/"), [mockErrors[0]]);
      });

      test("should filter the errors provided by the root provided [pass 2]", (): void => {
        assert.deepEqual(PathUtils.getErrorsForRoot(mockErrors, "#/b"), [mockErrors[2]]);
      });

      test("should recursively filter the errors provided by the root provided [pass 1]", (): void => {
        assert.deepEqual(PathUtils.getErrorsForRoot(mockErrors, "#/", true), mockErrors);
      });

      test("should recursively filter the errors provided by the root provided [pass 2]", (): void => {
        assert.deepEqual(PathUtils.getErrorsForRoot(mockErrors, "#/a", true), [mockErrors[1], mockErrors[3]]);
      });
    });

  });

}
