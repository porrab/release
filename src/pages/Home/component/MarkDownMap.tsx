import { Box, Typography, Link } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export const mdComponents = {
  p: ({ node, children }: any) => (
    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 1 }}>
      {children}
    </Typography>
  ),

  // headings
  h1: ({ children }: any) => (
    <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>
      {children}
    </Typography>
  ),
  h2: ({ children }: any) => (
    <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>
      {children}
    </Typography>
  ),
  h3: ({ children }: any) => (
    <Typography variant="subtitle1" sx={{ mt: 1.5, mb: 1, fontWeight: 600 }}>
      {children}
    </Typography>
  ),

  // lists
  ul: ({ children }: any) => (
    <Box component="ul" sx={{ pl: 3, mb: 1 }}>
      {children}
    </Box>
  ),
  ol: ({ children }: any) => (
    <Box component="ol" sx={{ pl: 3, mb: 1 }}>
      {children}
    </Box>
  ),
  li: ({ children }: any) => (
    <Box component="li" sx={{ mb: 0.5 }}>
      <Typography component="span" variant="body1">
        {children}
      </Typography>
    </Box>
  ),

  // links
  a: ({ href, children }: any) => (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </Link>
  ),

  // inline code and code blocks
  code({ node, inline, className, children }: any) {
    const match = /language-(\w+)/.exec(className || "");
    if (!inline && match) {
      return (
        <Box sx={{ my: 1 }}>
          <SyntaxHighlighter
            style={materialLight}
            language={match[1]}
            PreTag="div"
            customStyle={{ borderRadius: 6, padding: "12px" }}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </Box>
      );
    }

    return (
      <Box
        component="code"
        sx={{
          bgcolor: "action.selected",
          px: 0.5,
          py: 0.25,
          borderRadius: 0.5,
          fontFamily: "Monospace",
          fontSize: "0.875rem",
        }}
      >
        {children}
      </Box>
    );
  },

  // images (optional styling)
  img: ({ src, alt }: any) => (
    // ensure images are responsive
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{ maxWidth: "100%", borderRadius: 1, my: 1 }}
    />
  ),
};
