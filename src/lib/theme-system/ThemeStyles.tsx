import { themes } from './themes';

/**
 * Server component — injects all theme CSS as [data-theme="id"] selector blocks.
 * No JS needed to paint the correct theme; the browser handles it purely via CSS.
 * ThemeProvider just switches the `data-theme` attribute on <html>.
 */
export function ThemeStyles() {
  const css = Object.values(themes)
    .map(({ meta, light, dark }) => {
      const toVars = (colors: Record<string, string>) =>
        Object.entries(colors)
          .map(([k, v]) => `--${k}:${v}`)
          .join(';');

      return (
        `[data-theme="${meta.id}"]{${toVars(light)}}` +
        `[data-theme="${meta.id}"].dark{${toVars(dark)}}`
      );
    })
    .join('');

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
