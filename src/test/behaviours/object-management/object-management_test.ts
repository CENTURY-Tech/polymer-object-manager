namespace Century {

  sinon.spy((Century as any).PathUtils, "pathToRoot");
  sinon.spy((Century as any).PathUtils, "pathToLookup");
  sinon.spy((Century as any).PathUtils, "lookupToPath");

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
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target"));
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
        assert((testComponent.prepareTargetRoots as Sinon.SinonSpy).called);
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
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.$dirty", false));
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.$pristine", true));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
        testComponent.markTargetPathAsPristine(["foo"]);
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.foo.$dirty", false));
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.foo.$pristine", true));
      });
    });

    /**
     * Tests for "markTargetPathAsDirty".
     */
    suite("method: 'markTargetPathAsDirty'", (): void => {
      test("should call Polymers 'set' method with the correct values [pass 1]", (): void => {
        testComponent.markTargetPathAsDirty([]);
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.$dirty", true));
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.$pristine", false));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
        testComponent.markTargetPathAsDirty(["foo"]);
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.foo.$dirty", true));
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.foo.$pristine", false));
      });
    });

    /**
     * Tests for "markTargetPathAsValid".
     */
    suite("method: 'markTargetPathAsValid'", (): void => {
      test("should call Polymers 'set' method with the correct values [pass 1]", (): void => {
        testComponent.markTargetPathAsValid([]);
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.$valid", true));
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.$invalid", false));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
        testComponent.markTargetPathAsValid(["foo"]);
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.foo.$valid", true));
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.foo.$invalid", false));
      });
    });

    /**
     * Tests for "markTargetPathAsInvalid".
     */
    suite("method: 'markTargetPathAsInvalid'", (): void => {
      test("should call Polymers 'set' method with the correct values [pass 1]", (): void => {
        testComponent.markTargetPathAsInvalid([]);
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.$valid", false));
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.$invalid", true));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
        testComponent.markTargetPathAsInvalid(["foo"]);
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.foo.$valid", false));
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.foo.$invalid", true));
      });
    });

    /**
     * Tests for "setTargetPathRoot".
     */
    suite("method: 'setTargetPathRoot'", (): void => {
      test("should call Polymers 'set' method with the correct values [pass 1]", (): void => {
        testComponent.setTargetPathRoot("rooty", []);
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.$root", "rooty"));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
        testComponent.setTargetPathRoot("rooty", ["foo"]);
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.foo.$root", "rooty"));
      });
    });

    /**
     * Tests for "setTargetPathErrors".
     */
    suite("method: 'setTargetPathErrors'", (): void => {
      test("should call Polymers 'set' method with the correct values [pass 1]", (): void => {
        testComponent.setTargetPathErrors(mockErrors, []);
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.$errors", mockErrors));
      });

      test("should call Polymers 'set' method with the correct values [pass 2]", (): void => {
        testComponent.setTargetPathErrors(mockErrors, ["a"]);
        assert((testComponent.set as Sinon.SinonSpy).calledWith("target.a.$errors", mockErrors));
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
        (assert as any).nestedPropertyVal(testComponent.target, "$root", "#/");
        (assert as any).nestedPropertyVal(testComponent.target, "a.$root", "#/a");
        (assert as any).nestedPropertyVal(testComponent.target, "b.$root", "#/b");
        (assert as any).nestedPropertyVal(testComponent.target, "a.a.$root", "#/a/a");
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
        (assert as any).deepNestedPropertyVal(testComponent.target, "$errors", mockErrors);
        (assert as any).deepNestedPropertyVal(testComponent.target, "a.$errors", [mockErrors[1], mockErrors[3]]);
        (assert as any).deepNestedPropertyVal(testComponent.target, "b.$errors", [mockErrors[2]]);
        (assert as any).deepNestedPropertyVal(testComponent.target, "a.a.$errors", [mockErrors[3]]);
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
        assert((testComponent.markTargetPathAsValid as Sinon.SinonSpy).notCalled);
        assert((testComponent.markTargetPathAsInvalid as Sinon.SinonSpy).calledWith([]));
      });

      test("should correctly update the target's lookup validity keys (with errors) [pass 2]", (): void => {
        testComponent.assignTargetErrorsForPath(mockErrors, ["b"]);
        assert((testComponent.markTargetPathAsValid as Sinon.SinonSpy).notCalled);
        assert((testComponent.markTargetPathAsInvalid as Sinon.SinonSpy).calledWith(["b"]));
      });

      test("should correctly update the target's lookup validity keys (with errors) [pass 3]", (): void => {
        testComponent.assignTargetErrorsForPath(mockErrors, ["a", "a"]);
        assert((testComponent.markTargetPathAsValid as Sinon.SinonSpy).notCalled);
        assert((testComponent.markTargetPathAsInvalid as Sinon.SinonSpy).calledWith(["a", "a"]));
      });

      test("should correctly update the target's lookup validity keys (without errors) [pass 1]", (): void => {
        testComponent.assignTargetErrorsForPath([], []);
        assert((testComponent.markTargetPathAsValid as Sinon.SinonSpy).calledWith([]));
        assert((testComponent.markTargetPathAsInvalid as Sinon.SinonSpy).notCalled);
      });

      test("should correctly update the target's lookup validity keys (without errors) [pass 2]", (): void => {
        testComponent.assignTargetErrorsForPath([], ["b"]);
        assert((testComponent.markTargetPathAsValid as Sinon.SinonSpy).calledWith(["b"]));
        assert((testComponent.markTargetPathAsInvalid as Sinon.SinonSpy).notCalled);
      });

      test("should correctly update the target's lookup validity keys (without errors) [pass 3]", (): void => {
        testComponent.assignTargetErrorsForPath([], ["a", "a"]);
        assert((testComponent.markTargetPathAsValid as Sinon.SinonSpy).calledWith(["a", "a"]));
        assert((testComponent.markTargetPathAsInvalid as Sinon.SinonSpy).notCalled);
      });
    });
  });

}
