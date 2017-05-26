namespace Century {

  const assert: Chai.Assert = chai.assert;

  suite("behaviour: \"object-management\"", (): void => {
    let testComponent: any;

    setup((): void => {

      testComponent = document.createElement("test-element");

    });

    suite("method: \"persistChanges\"", (): void => {
      //
    });

    suite("method: \"resetChanges\"", (): void => {
      test("should set the target with a cloned copy of the original", (): void => {
        testComponent.original = {
          foo: "bar"
        };

        testComponent.resetChanges();

        assert.equal(testComponent.target.foo, testComponent.original.foo);
        assert.notStrictEqual(testComponent.target, testComponent.original);
      });
    });

    suite("method: \"validateChanges\"", (): void => {
      //
    });
  });

}
