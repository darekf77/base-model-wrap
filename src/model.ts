export interface model<T> {
  propertyPath: string;
  class: { new (any?): T };
}
