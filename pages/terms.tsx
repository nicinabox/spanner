import { getHtmlFromMarkdown } from "../utils/getContentFile";

const Terms = ({ html }) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export async function getStaticProps() {
    const html = getHtmlFromMarkdown('terms.md');

    return {
        props: {
            html,
        },
    }
}

export default Terms;
