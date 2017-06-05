namespace Century {

  suite("namespace: 'OMObjectUtils'", (): void => {

    const OMObjectUtils: any = Century["OMObjectUtils"];

    /**
     * Tests for "deconstructObject".
     */
    suite("method: 'deconstructObject'", (): void => {
      test("should return the expected lookups and values [pass 1]", (): void => {
        assert.deepEqual(OMObjectUtils.deconstructObject(mockObj), [
          ["a", mockObj.a],
          ["a.a", mockObj.a.a],
          ["a.a.a", mockObj.a.a.a],
          ["a.b", mockObj.a.b],
          ["b", mockObj.b],
          ["b.a", mockObj.b.a],
          ["c", mockObj.c],
        ]);
      });

      test("should return the expected lookups and values [pass 2]", (): void => {
        assert.deepEqual(OMObjectUtils.deconstructObject(mockArr), [
          ["0", mockArr[0]],
          ["0.a", mockArr[0].a],
          ["0.a.a", mockArr[0].a.a],
          ["0.a.a.a", mockArr[0].a.a.a],
          ["0.a.b", mockArr[0].a.b],
          ["1", mockArr[1]],
          ["1.b", mockArr[1].b],
          ["1.b.a", mockArr[1].b.a],
          ["2", mockArr[2]],
          ["2.c", mockArr[2].c],
        ]);
      });
    });

    /**
     * Tests for "walkObjectFor".
     */
    suite("method: 'walkObjectFor'", (): void => {
      test("should return the expected lookups and values [pass 1]", (): void => {
        assert.deepEqual(OMObjectUtils.walkObjectFor(mockObj, Object), [
          ["a", mockObj.a],
          ["a.a", mockObj.a.a],
          ["b", mockObj.b],
        ]);
      });

      test("should return the expected lookups and values [pass 2]", (): void => {
        assert.deepEqual(OMObjectUtils.walkObjectFor(mockArr, Object), [
          ["0", mockArr[0]],
          ["0.a", mockArr[0].a],
          ["0.a.a", mockArr[0].a.a],
          ["1", mockArr[1]],
          ["1.b", mockArr[1].b],
          ["2", mockArr[2]],
        ]);
      });
    });

  });

}
