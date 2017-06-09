namespace Century {

  @component("test-element")
  @behavior(Century["ObjectManagement"])
  export class TestElement extends polymer.Base {

    // Placeholder element for testing purposes.

  }

  TestElement.register();

  export const assert: Chai.Assert = chai.assert;

  /**
   * A mock Object to optionally be used as the target Object for the Object Manager behaviour.
   */
  export const mockObj = {
    a: { a: { a: "foo" }, b: "foo" },
    b: { a: "foo" },
    c: "foo",
  };

  /**
   * A mock Array to test the static Object Manager methods in extraneous circumstances.
   */
  export const mockArr: any[] = [
    { a: { a: { a: "foo" }, b: "foo" } },
    { b: { a: "foo" } },
    { c: "foo" },
  ];

  /**
   * An Array of mock validation Errors.
   */
  export const mockErrors: any[] = [
    { path: "#/" },
    { path: "#/a" },
    { path: "#/b" },
    { path: "#/a/a" },
  ];

}
