import RomanticLetter from "./RomanticLetter";

type TemplateRendererProps = {
  data: any;
};

export default function TemplateRenderer({ data }: TemplateRendererProps) {
  const templates: Record<string, React.ComponentType<{ data?: any }>> = {
    "romantic-letter": RomanticLetter,
  };

  const templateKey =
    data?.selectedTemplate ||
    data?.templateId ||
    "romantic-letter";

  const SelectedTemplate = templates[templateKey] || RomanticLetter;

  return <SelectedTemplate data={data} />;
}