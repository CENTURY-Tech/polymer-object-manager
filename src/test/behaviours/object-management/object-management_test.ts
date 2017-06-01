namespace Century {

  const assert: Chai.Assert = chai.assert;

  const mockObj = {
    a: {
      a: {
        a: "foo"
      },
      b: "foo"
    },
    b: {
      a: "foo"
    },
    c: "foo"
  };

  suite("behaviour: 'ObjectManagement'", (): void => {
    let testComponent: any;

    setup((): void => {
      testComponent = document.createElement("test-element");

      testComponent.set("target", {});
      testComponent.set("schema", {});
    });

    suite("method: 'persistChanges'", (): void => {
      //
    });

    suite("method: 'resetChanges'", (): void => {
      test("should set the target with a cloned copy of the original", (): void => {
        testComponent.original = {
          foo: "bar"
        };

        testComponent.resetChanges();

        assert.equal(testComponent.target.foo, testComponent.original.foo);
        assert.notStrictEqual(testComponent.target, testComponent.original);
      });
    });

    suite("method: 'validateChanges'", (): void => {
      //
    });
  });

  suite("namespace: 'ObjectManagement'", (): void => {
    const ObjectManagement: any = Century["ObjectManagement"];

    suite("method: 'walkObjectFor'", (): void => {
      assert.deepEqual(ObjectManagement.walkObjectFor(mockObj, Object), [
        ["a", { a: { a: "foo" }, b: "foo" }],
        ["a.a", { a: "foo" }],
        ["b", { a: "foo" }]
      ]);
    });

    suite("method: 'deconstructObject'", (): void => {
      assert.deepEqual(ObjectManagement.deconstructObject(mockObj), [
        ["a", { a: { a: "foo" }, b: "foo" }],
        ["a.a", { a: "foo" }],
        ["a.a.a", "foo"],
        ["a.b", "foo"],
        ["b", { a: "foo" }],
        ["b.a", "foo"],
        ["c", "foo"]
      ]);
    });
  });

}
