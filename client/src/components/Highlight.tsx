import { CodeHighlight, CodeHighlightAdapterProvider, createHighlightJsAdapter } from '@mantine/code-highlight';
import { useMantineColorScheme } from '@mantine/core';
import hljs from 'highlight.js/lib/core';
import cssLang from 'highlight.js/lib/languages/css';

hljs.registerLanguage('css', cssLang);

const highlightJsAdapter = createHighlightJsAdapter(hljs);
// Export Highlight as default to use code splitting
const Highlight = ({ code }: { code: string }) => {
  const { colorScheme } = useMantineColorScheme();
  const themeClass = colorScheme === 'dark' ? 'hljs-dark' : 'hljs-light';
  return (
    <div className={themeClass}>
      <CodeHighlightAdapterProvider adapter={highlightJsAdapter} >
        <CodeHighlight language="css" key={code} my="sm" code={code} radius="md" copyLabel='Copy CSS' />
      </CodeHighlightAdapterProvider>
    </div>
  )
}

export default Highlight