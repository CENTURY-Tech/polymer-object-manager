namespace Century {

  /**
   * Object Management behaviour.
   *
   * @class
   * @extends polymer.Base
   */
  export class ObjectManagement<T> extends polymer.Base {

    /**
     * The target Object to be managed.
     */
    @property({ type: Object, notify: true })
    public target: T;

    /**
     * The schema with which to perform any validation.
     */
    @property({ type: Object })
    public schema: object;

    /**
     * An backup of the original "target".
     */
    private original: T;

    // public async persistChanges(): Promise<void> {

    // }

    public resetChanges(): void {
      this.set("target", R.clone(this.original));
    }

    // public validateChanges(): void {

    // }

    @observe("target")
    public handleTargetAssigned(): void {
      //
    }

    @observe("target.*")
    public handleTargetUpdated(): void {
      //
    }

    // private markAsPristine(): void {

    // }

    // private markAsDirty(): void {

    // }

  }

}
