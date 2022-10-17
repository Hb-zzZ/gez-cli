export const renderString = (template: string, context: { [propName: string]: any }) => {
  return template.replace(/\[\[(.*?)\]\]/g, (match, key) => context[key.trim()])
}
