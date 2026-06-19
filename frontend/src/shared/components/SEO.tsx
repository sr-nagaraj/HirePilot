import { Helmet } from "react-helmet-async";
import { APP_NAME } from "../constants/app";

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
  type?: string;
}

const SITE_URL = "https://hirepilot.ai";
const DEFAULT_IMAGE = "/assets/hirepilot-platform-preview.png";

export function SEO({
  title,
  description,
  canonicalPath = "/",
  image = DEFAULT_IMAGE,
  type = "website",
}: SEOProps) {
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
