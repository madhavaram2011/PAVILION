interface SectionHeaderProps {
  label: string
  title: string
  titleHighlight?: string
  subtitle?: string
  center?: boolean
}

export default function SectionHeader({
  label, title, titleHighlight, subtitle, center = false,
}: SectionHeaderProps) {
  return (
    <div className={center ? 'text-center' : ''}>
      <p className="section-label">{label}</p>
      <h2 className="section-title">
        {title}{' '}
        {titleHighlight && (
          <em className="text-forest-600 not-italic">{titleHighlight}</em>
        )}
      </h2>
      <div className={`divider-earth ${center ? 'mx-auto' : ''}`} />
      {subtitle && (
        <p className={`section-subtitle mt-3 ${center ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}