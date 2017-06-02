namespace Century {

  const assert: Chai.Assert = chai.assert;

  const mockObj = {
    a: { a: { a: "foo" }, b: "foo" },
    b: { a: "foo" },
    c: "foo",
  };

  const mockArr = [
    { a: { a: { a: "foo" }, b: "foo" } },
    { b: { a: "foo" } },
    { c: "foo" },
  ];

  const mockErrors = [
    { path: "#/" },
    { path: "#/foo" },
    { path: "#/foo/bar" },
    { path: "#/foo/bar/baz" },
  ];

  sinon.spy(Century["ObjectManagement"], "pathToRoot");
  sinon.spy(Century["ObjectManagement"], "pathToLookup");
  sinon.spy(Century["ObjectManagement"], "lookupToPath");

  suite("behaviour: 'ObjectManagement'", (): void => {
    let testComponent: any;

    setup((): void => {
      testComponent = document.createElement("test-element");

      testComponent.set("target", {});
      testComponent.set("schema", {});

      sinon.spy(testComponent, "set");
    });

    /**
     * Tests for "persistChanges".
     */
    suite("method: 'persistChanges'", (): void => {
      //
    });

    /**
     * Tests for "resetChanges".
     */
    suite("method: 'resetChanges'", (): void => {
      setup((): void => {
        testComponent.target = testComponent.original = { foo: "bar", bar: "baz" };
      });

      test("should call Polymers 'set' method to reset the target", (): void => {
        testComponent.resetChanges();
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target"));
      });

      test("should set the target with a cloned copy of the original [pass 1]", (): void => {
        testComponent.resetChanges();
        assert.equal(testComponent.target.foo, testComponent.original.foo);
      });

      test("should set the target with a cloned copy of the original [pass 2]", (): void => {
        testComponent.resetChanges();
        assert.equal(testComponent.target.bar, testComponent.original.bar);
      });

      test("should set the target with a cloned copy of the original [pass 3]", (): void => {
        testComponent.resetChanges();
        assert.notStrictEqual(testComponent.target, testComponent.original);
      });
    });

    /**
     * Tests for "validateChanges".
     */
    suite("method: 'validateChanges'", (): void => {
      setup((): void => {
        sinon.spy(testComponent, "processTargetErrors");
      });

      test("should not attempt validation unless the target, schema, and validator are defined [pass 1]", (): void => {
        testComponent.target = null;

        testComponent.validateChanges();
        assert((<Sinon.SinonSpy>testComponent.processTargetErrors).notCalled);
      });

      test("should not attempt validation unless the target, schema, and validator are defined [pass 2]", (): void => {
        testComponent.schema = null;

        testComponent.validateChanges();
        assert((<Sinon.SinonSpy>testComponent.processTargetErrors).notCalled);
      });

      test("should not attempt validation unless the target, schema, and validator are defined [pass 3]", (): void => {
        testComponent.validator = null;

        testComponent.validateChanges();
        assert((<Sinon.SinonSpy>testComponent.processTargetErrors).notCalled);
      });

      test("should not attempt validation unless the target, schema, and validator are defined [pass 4]", (): void => {
        testComponent.validateChanges();
        assert((<Sinon.SinonSpy>testComponent.processTargetErrors).called);
      });
    });

    /**
     * Tests for "handleTargetUpdated".
     */
    suite("method: 'handleTargetUpdated'", (): void => {
      //
    });

    /**
     * Tests for "markTargetPathAsPristine".
     */
    suite("method: 'markTargetPathAsPristine'", (): void => {
      test("should call Polymers 'set' method with the correct values [pass 1]", (): void => {
        testComponent.markTargetPathAsPristine();
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$dirty", false));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$pristine", true));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
        testComponent.markTargetPathAsPristine([]);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$dirty", false));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$pristine", true));
      });

      test("should call Polymers 'set' method with the correct values [pass 3]", (): void => {
        testComponent.markTargetPathAsPristine(["foo"]);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.foo.$dirty", false));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.foo.$pristine", true));
      });
    });

    /**
     * Tests for "markTargetPathAsDirty".
     */
    suite("method: 'markTargetPathAsDirty'", (): void => {
      test("should call Polymers 'set' method with the correct values [pass 1]", (): void => {
        testComponent.markTargetPathAsDirty();
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$dirty", true));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$pristine", false));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
        testComponent.markTargetPathAsDirty([]);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$dirty", true));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$pristine", false));
      });

      test("should call Polymers 'set' method with the correct values [pass 3]", (): void => {
        testComponent.markTargetPathAsDirty(["foo"]);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.foo.$dirty", true));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.foo.$pristine", false));
      });
    });

    /**
     * Tests for "markTargetPathAsValid".
     */
    suite("method: 'markTargetPathAsValid'", (): void => {
      test("should call Polymers 'set' method with the correct values [pass 1]", (): void => {
        testComponent.markTargetPathAsValid();
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$valid", true));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$invalid", false));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
        testComponent.markTargetPathAsValid([]);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$valid", true));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$invalid", false));
      });

      test("should call Polymers 'set' method with the correct values [pass 3]", (): void => {
        testComponent.markTargetPathAsValid(["foo"]);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.foo.$valid", true));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.foo.$invalid", false));
      });
    });

    /**
     * Tests for "markTargetPathAsInvalid".
     */
    suite("method: 'markTargetPathAsInvalid'", (): void => {
      test("should call Polymers 'set' method with the correct values [pass 1]", (): void => {
        testComponent.markTargetPathAsInvalid();
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$valid", false));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$invalid", true));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
        testComponent.markTargetPathAsInvalid([]);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$valid", false));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$invalid", true));
      });

      test("should call Polymers 'set' method with the correct values [pass 3]", (): void => {
        testComponent.markTargetPathAsInvalid(["foo"]);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.foo.$valid", false));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.foo.$invalid", true));
      });
    });

    /**
     * Tests for "setTargetPathRoot".
     */
    suite("method: 'setTargetPathRoot'", (): void => {
      test("should call Polymers 'set' method with the correct values [pass 1]", (): void => {
        testComponent.setTargetPathRoot("rooty", []);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$root", "rooty"));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
        testComponent.setTargetPathRoot("rooty", ["foo"]);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.foo.$root", "rooty"));
      });
    });

    /**
     * Tests for "setTargetPathErrors".
     */
    suite("method: 'setTargetPathErrors'", (): void => {
      test("should call Polymers 'set' method with the correct values [pass 1]", (): void => {
        testComponent.setTargetPathErrors(mockErrors, []);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$errors", mockErrors));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
        testComponent.setTargetPathErrors(mockErrors, ["foo"]);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.foo.$errors", mockErrors));
      });
    });

    /**
     * Tests for "prepareTargetRoots".
     */
    suite("method: 'prepareTargetRoots'", (): void => {
      //
    });

    /**
     * Tests for "processTargetErrors".
     */
    suite("method: 'processTargetErrors'", (): void => {
      //
    });

    /**
     * Tests for "assignTargetErrorsForPath".
     */
    suite("method: 'assignTargetErrorsForPath'", (): void => {
      //
    });
  });

  suite("namespace: 'ObjectManagement'", (): void => {
    const ObjectManagement: any = Century["ObjectManagement"];

    /**
     * Tests for "deconstructObject".
     */
    suite("method: 'deconstructObject'", (): void => {
      test("should return the expected lookups and values [pass 1]", (): void => {
        assert.deepEqual(ObjectManagement.deconstructObject(mockObj), [
          ["a", { a: { a: "foo" }, b: "foo" }],
          ["a.a", { a: "foo" }],
          ["a.a.a", "foo"],
          ["a.b", "foo"],
          ["b", { a: "foo" }],
          ["b.a", "foo"],
          ["c", "foo"],
        ]);
      });

      test("should return the expected lookups and values [pass 2]", (): void => {
        assert.deepEqual(ObjectManagement.deconstructObject(mockArr), [
          ["0", { a: { a: { a: "foo" }, b: "foo" } }],
          ["0.a", { a: { a: "foo" }, b: "foo" }],
          ["0.a.a", { a: "foo" }],
          ["0.a.a.a", "foo"],
          ["0.a.b", "foo"],
          ["1", { b: { a: "foo" } }],
          ["1.b", { a: "foo" }],
          ["1.b.a", "foo"],
          ["2", { c: "foo" }],
          ["2.c", "foo"],
        ]);
      });
    });

    /**
     * Tests for "walkObjectFor".
     */
    suite("method: 'walkObjectFor'", (): void => {
      test("should return the expected lookups and values [pass 1]", (): void => {
        assert.deepEqual(ObjectManagement.walkObjectFor(mockObj, Object), [
          ["a", { a: { a: "foo" }, b: "foo" }],
          ["a.a", { a: "foo" }],
          ["b", { a: "foo" }],
        ]);
      });

      test("should return the expected lookups and values [pass 2]", (): void => {
        assert.deepEqual(ObjectManagement.walkObjectFor(mockArr, Object), [
          ["0", { a: { a: { a: "foo" }, b: "foo" } }],
          ["0.a", { a: { a: "foo" }, b: "foo" }],
          ["0.a.a", { a: "foo" }],
          ["1", { b: { a: "foo" } }],
          ["1.b", { a: "foo" }],
          ["2", { c: "foo" }],
        ]);
      });
    });

    /**
     * Tests for "pathToRoot".
     */
    suite("method: 'pathToRoot'", (): void => {
      test("should return the expected root string for the path provided [pass 1]", (): void => {
        assert.equal(ObjectManagement.pathToRoot(), "#/");
      });

      test("should return the expected root string for the path provided [pass 2]", (): void => {
        assert.equal(ObjectManagement.pathToRoot([]), "#/");
      });

      test("should return the expected root string for the path provided [pass 3]", (): void => {
        assert.equal(ObjectManagement.pathToRoot(["foo"]), "#/foo");
      });

      test("should return the expected root string for the path provided [pass 4]", (): void => {
        assert.equal(ObjectManagement.pathToRoot(["foo", "bar"]), "#/foo/bar");
      });
    });

    /**
     * Tests for "pathToLookup".
     */
    suite("method: 'pathToLookup'", (): void => {
      test("should return the expected lookup string for the path provided [pass 1]", (): void => {
        assert.equal(ObjectManagement.pathToLookup(), "");
      });

      test("should return the expected lookup string for the path provided [pass 2]", (): void => {
        assert.equal(ObjectManagement.pathToLookup([]), "");
      });

      test("should return the expected lookup string for the path provided [pass 3]", (): void => {
        assert.equal(ObjectManagement.pathToLookup(["foo"]), "foo");
      });

      test("should return the expected lookup string for the path provided [pass 4]", (): void => {
        assert.equal(ObjectManagement.pathToLookup(["foo", "bar"]), "foo.bar");
      });
    });

    /**
     * Tests for "lookupToPath".
     */
    suite("method: 'lookupToPath'", (): void => {
      test("should return the expected Object keys for the lookup string provided [pass 1]", (): void => {
        assert.deepEqual(ObjectManagement.lookupToPath(), []);
      });

      test("should return the expected Object keys for the lookup string provided [pass 2]", (): void => {
        assert.deepEqual(ObjectManagement.lookupToPath(""), []);
      });

      test("should return the expected Object keys for the lookup string provided [pass 3]", (): void => {
        assert.deepEqual(ObjectManagement.lookupToPath("foo"), ["foo"]);
      });

      test("should return the expected Object keys for the lookup string provided [pass 4]", (): void => {
        assert.deepEqual(ObjectManagement.lookupToPath("foo.bar"), ["foo", "bar"]);
      });
    });

    /**
     * Tests for "getErrorsForRoot".
     */
    suite("method: 'getErrorsForRoot'", (): void => {
      test("should filter the errors provided by the root provided [pass 1]", (): void => {
        assert.deepEqual(ObjectManagement.getErrorsForRoot(mockErrors, "#/"), [mockErrors[0]]);
      });

      test("should filter the errors provided by the root provided [pass 2]", (): void => {
        assert.deepEqual(ObjectManagement.getErrorsForRoot(mockErrors, "#/foo/bar"), [mockErrors[2]]);
      });

      test("should recursively filter the errors provided by the root provided [pass 1]", (): void => {
        assert.deepEqual(ObjectManagement.getErrorsForRoot(mockErrors, "#/", true), mockErrors);
      });

      test("should recursively filter the errors provided by the root provided [pass 2]", (): void => {
        assert.deepEqual(ObjectManagement.getErrorsForRoot(mockErrors, "#/foo/bar", true), R.takeLast(2, mockErrors));
      });
    });
  });

}
