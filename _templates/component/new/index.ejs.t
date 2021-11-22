---
to: "<%= locals.path ? `src/components/${path}/${name}/index.tsx` : `src/components/${name}/index.tsx` %>"

---
export * from './<%= name %>';
export { default } from './<%= name %>';
