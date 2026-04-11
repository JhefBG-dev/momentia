import RomanticLetter from "./RomanticLetter";

type TemplateRendererProps = {
  data: any;
};

export default function TemplateRenderer({ data }: TemplateRendererProps) {
  const templates: Record<string, React.ComponentType<{ data: any }>> = {
    "romantic-letter": RomanticLetter,
  };

  const SelectedTemplate =
    templates[data.selectedTemplate] || RomanticLetter;

  return <SelectedTemplate data={data} />;
}