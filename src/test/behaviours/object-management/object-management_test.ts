namespace Century {

  sinon.spy(Century["OMPathUtils"], "pathToRoot");
  sinon.spy(Century["OMPathUtils"], "pathToLookup");
  sinon.spy(Century["OMPathUtils"], "lookupToPath");

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
      setup((): void => {
        sinon.spy(testComponent, "prepareTargetRoots");
      });

      test("should clone the target Object when it is set", (): void => {
        testComponent.handleTargetUpdated({ base: mockObj, path: "target" });
        assert.deepEqual(testComponent.original, mockObj);
        assert.notStrictEqual(testComponent.original, mockObj);
      });

      test("should call the 'prepareTargetRoots' method when it is set", (): void => {
        testComponent.handleTargetUpdated({ base: mockObj, path: "target" });
        assert((<Sinon.SinonSpy>testComponent.prepareTargetRoots).called);
      });

      test("should mark the target Object as pristine when it is set", (): void => {
        testComponent.handleTargetUpdated({ base: mockObj, path: "target" });
        assert.isTrue(testComponent.target.$pristine);
        assert.isFalse(testComponent.target.$dirty);
      });

      test("should mark the target Object as dirty when it is updated", (): void => {
        testComponent.handleTargetUpdated({ base: mockObj, path: "target.foo" });
        assert.isTrue(testComponent.target.$dirty);
        assert.isFalse(testComponent.target.$pristine);
      });

      test("should ignore updates made to '$' properties [pass 1]", (): void => {
        assert.isFalse(testComponent.handleTargetUpdated({ path: "target.$foo" }));
      });

      test("should ignore updates made to '$' properties [pass 2]", (): void => {
        assert.isFalse(testComponent.handleTargetUpdated({ path: "target.foo.bar.$baz" }));
      });
    });

    /**
     * Tests for "markTargetPathAsPristine".
     */
    suite("method: 'markTargetPathAsPristine'", (): void => {
      test("should call Polymers 'set' method with the correct values [pass 1]", (): void => {
        testComponent.markTargetPathAsPristine([]);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$dirty", false));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$pristine", true));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
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
        testComponent.markTargetPathAsDirty([]);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$dirty", true));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$pristine", false));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
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
        testComponent.markTargetPathAsValid([]);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$valid", true));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$invalid", false));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
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
        testComponent.markTargetPathAsInvalid([]);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$valid", false));
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.$invalid", true));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
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
        testComponent.setTargetPathErrors(mockErrors, ["a"]);
        assert((<Sinon.SinonSpy>testComponent.set).calledWith("target.a.$errors", mockErrors));
      });
    });

    /**
     * Tests for "prepareTargetRoots".
     */
    suite("method: 'prepareTargetRoots'", (): void => {
      setup((): void => {
        testComponent.target = R.clone(mockObj);
      });

      test("should have recursively prepared the target roots upon completion", (): void => {
        testComponent.prepareTargetRoots();
        assert["nestedPropertyVal"](testComponent.target, "$root", "#/");
        assert["nestedPropertyVal"](testComponent.target, "a.$root", "#/a");
        assert["nestedPropertyVal"](testComponent.target, "b.$root", "#/b");
        assert["nestedPropertyVal"](testComponent.target, "a.a.$root", "#/a/a");
      });
    });

    /**
     * Tests for "processTargetErrors".
     */
    suite("method: 'processTargetErrors'", (): void => {
      setup((): void => {
        testComponent.target = R.clone(mockObj);
      });

      test("should have recursively prepared the target errors upon completion", (): void => {
        testComponent.processTargetErrors(mockErrors);
        assert["deepNestedPropertyVal"](testComponent.target, "$errors", mockErrors);
        assert["deepNestedPropertyVal"](testComponent.target, "a.$errors", [mockErrors[1], mockErrors[3]]);
        assert["deepNestedPropertyVal"](testComponent.target, "b.$errors", [mockErrors[2]]);
        assert["deepNestedPropertyVal"](testComponent.target, "a.a.$errors", [mockErrors[3]]);
      });
    });

    /**
     * Tests for "assignTargetErrorsForPath".
     */
    suite("method: 'assignTargetErrorsForPath'", (): void => {
      setup((): void => {
        testComponent.target = R.clone(mockObj);

        sinon.spy(testComponent, "markTargetPathAsValid");
        sinon.spy(testComponent, "markTargetPathAsInvalid");
      });

      test("should assign the provided errors to the path provided [pass 1]", (): void => {
        testComponent.assignTargetErrorsForPath(mockErrors, []);
        assert.deepEqual(testComponent.target.$errors, mockErrors);
      });

      test("should assign the provided errors to the path provided [pass 2]", (): void => {
        testComponent.assignTargetErrorsForPath(mockErrors, ["a"]);
        assert.deepEqual(testComponent.target.a.$errors, mockErrors);
      });

      test("should assign the provided errors to the path provided [pass 3]", (): void => {
        testComponent.assignTargetErrorsForPath(mockErrors, ["a", "a"]);
        assert.deepEqual(testComponent.target.a.a.$errors, mockErrors);
      });

      test("should correctly update the target's lookup validity keys (with errors) [pass 1]", (): void => {
        testComponent.assignTargetErrorsForPath(mockErrors, []);
        assert((<Sinon.SinonSpy>testComponent.markTargetPathAsValid).notCalled);
        assert((<Sinon.SinonSpy>testComponent.markTargetPathAsInvalid).calledWith([]));
      });

      test("should correctly update the target's lookup validity keys (with errors) [pass 2]", (): void => {
        testComponent.assignTargetErrorsForPath(mockErrors, ["b"]);
        assert((<Sinon.SinonSpy>testComponent.markTargetPathAsValid).notCalled);
        assert((<Sinon.SinonSpy>testComponent.markTargetPathAsInvalid).calledWith(["b"]));
      });

      test("should correctly update the target's lookup validity keys (with errors) [pass 3]", (): void => {
        testComponent.assignTargetErrorsForPath(mockErrors, ["a", "a"]);
        assert((<Sinon.SinonSpy>testComponent.markTargetPathAsValid).notCalled);
        assert((<Sinon.SinonSpy>testComponent.markTargetPathAsInvalid).calledWith(["a", "a"]));
      });

      test("should correctly update the target's lookup validity keys (without errors) [pass 1]", (): void => {
        testComponent.assignTargetErrorsForPath([], []);
        assert((<Sinon.SinonSpy>testComponent.markTargetPathAsValid).calledWith([]));
        assert((<Sinon.SinonSpy>testComponent.markTargetPathAsInvalid).notCalled);
      });

      test("should correctly update the target's lookup validity keys (without errors) [pass 2]", (): void => {
        testComponent.assignTargetErrorsForPath([], ["b"]);
        assert((<Sinon.SinonSpy>testComponent.markTargetPathAsValid).calledWith(["b"]));
        assert((<Sinon.SinonSpy>testComponent.markTargetPathAsInvalid).notCalled);
      });

      test("should correctly update the target's lookup validity keys (without errors) [pass 3]", (): void => {
        testComponent.assignTargetErrorsForPath([], ["a", "a"]);
        assert((<Sinon.SinonSpy>testComponent.markTargetPathAsValid).calledWith(["a", "a"]));
        assert((<Sinon.SinonSpy>testComponent.markTargetPathAsInvalid).notCalled);
      });
    });
  });

}
