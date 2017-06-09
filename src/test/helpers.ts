namespace Century {

  @component("test-element")
  @behavior(Century["ObjectManagement"])
  export class TestElement extends polymer.Base {

    public ready(): void {
      this.set("target", {
        _id: "957e3ae2-d8e5-4bb8-95c6-9d0e4c1da35e",
        name: "Iain's course 👨🏼‍💻",
        organisation: "4af9f952-4d5f-4cff-9fce-0f1163c138b9",
        description: "😳 🍮 🍔",
        history: {
          firstVersion: {
            createdAt: "2016-12-01T12:00:15.918Z",
            createdBy: "3692f1a9-038b-461c-a2bb-52d95097a91c",
          },
          thisVersion: {
            isDeprecated: false,
            version: 237,
            prevId: "5ba24732-022e-49d4-b180-8860c7a04cfa",
            updatedAt: "2017-06-05T16:32:54.545Z",
            updatedBy: "3692f1a9-038b-461c-a2bb-52d95097a91c",
          },
        },
        isPublished: true,
        isEnabled: true,
        isTest: false,
        isPublic: false,
        labels: [
          {
            _id: "03d06410-e23f-41bd-a661-878d5a2ee9ea",
            name: "⌨",
            colour: "#c153fc",
          },
          {
            _id: "201b02ba-33f2-45ff-991b-09497da78277",
            name: "🤡",
            colour: "#9bf291",
          }
        ],
        strands: [
          {
            name: "Emoji time 🍕",
            nuggets: [
              {
                _id: "ec966293-c864-47e9-ac28-186dd163fa2f",
                name: "🍗",
                isPublished: false,
                isPublic: false,
                prerequisites: [
                  "57605ba5-82f4-4fdf-a2f5-364d64815492"
                ],
              },
              {
                _id: "57605ba5-82f4-4fdf-a2f5-364d64815492",
                name: "🐔",
                isPublished: false,
                isPublic: false,
                prerequisites: [],
              },
              {
                _id: "ad7a20a3-84b3-42f7-9132-50b2682a1ee6",
                name: "🥔",
                isPublished: false,
                isPublic: false,
                prerequisites: [],
              }
            ],
            weight: 0,
            id: "c380ceae-143b-4967-9520-15dd2fc09831",
          },
          {
            name: "New strand",
            nuggets: [
              {
                _id: "14b25287-8fe4-4d5b-a4f3-60d4ca92f685",
                name: "1",
                isPublished: false,
                isPublic: false,
                prerequisites: [],
              },
              {
                _id: "c3f62bbb-a708-450e-8843-9c3b15daf375",
                name: "2",
                isPublished: false,
                isPublic: false,
                prerequisites: [],
              },
              {
                _id: "fcfe22c3-d22e-40ae-9e76-24d6bd60e973",
                name: "3",
                isPublished: false,
                isPublic: false,
                prerequisites: [],
              },
              {
                _id: "1794fb5d-045a-428e-9900-0744d6f37050",
                name: "4",
                isPublished: false,
                isPublic: false,
                prerequisites: [],
              },
              {
                _id: "232f6861-0874-4ba4-9d51-95666104c6d9",
                name: "5",
                isPublished: false,
                isPublic: false,
                prerequisites: [],
              },
              {
                _id: "cecc0918-7150-472b-a50c-07fcf0f877e1",
                name: "6",
                isPublished: false,
                isPublic: false,
                prerequisites: [],
              }
            ],
            weight: 0,
            id: "adb407a6-f471-4931-813b-9184655b1784",
          }
        ],
        type: "standard",
        __v: 224,
        level: {
          _id: "923e1b3d-8452-4e98-8b90-685da32a596b",
          name: "A Level",
          colour: "",
        },
        subject: {
          _id: "d2fb0442-7ad3-4ac8-9b08-86bd3efa5aab",
          name: "Mathematics",
          colour: "",
        },
      });

      this.set("mergeHandlers", [{
        search: /^strands.\d$/,
        observe: [
          "name"
        ],
        handler: this.handleStrandMerge,
        objectSignature: "id"
      }]);

      this.set("sortHandlers", [{
        search: /^strands$/,
        handler: this.handleStrandSort,
        itemSignature: "id",
        parentSignature: "_id"
      }]);
    }

    private async handleStrandMerge(action: string, lookup: string, value: any): Promise<void> {
      console.log("handleStrandMerge", action, lookup, value);
    }

    private async handleStrandSort(action: string, lookup: string, value: any): Promise<void> {
      console.log("handleStrandSorting", action, lookup, value);
    }

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
