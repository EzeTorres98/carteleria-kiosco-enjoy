interface Props {
  data: { url: string; label?: string }
}

export default function ImageSlide({ data }: Props) {
  return (
    <div className="w-full h-full bg-black">
      <img
        src={data.url}
        alt={data.label ?? ''}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
