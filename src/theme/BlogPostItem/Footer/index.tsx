import React, {type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import {DiscussionEmbed} from 'disqus-react';
import Footer from '@theme-original/BlogPostItem/Footer';
import type FooterType from '@theme/BlogPostItem/Footer';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof FooterType>;

const DISQUS_SHORTNAME = 'li-ji-lei-leo-lee-1';

export default function FooterWrapper(props: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const {isBlogPostPage, metadata} = useBlogPost();

  return (
    <>
      <Footer {...props} />
      {isBlogPostPage && (
        <div className="margin-top--xl">
          <DiscussionEmbed
            shortname={DISQUS_SHORTNAME}
            config={{
              url: new URL(metadata.permalink, siteConfig.url).toString(),
              identifier: metadata.permalink,
              title: metadata.title,
              language: 'zh-CN',
            }}
          />
        </div>
      )}
    </>
  );
}
