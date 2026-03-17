import { useNavigate } from "react-router-dom"

interface Props {
  text: string
  to: string
}

export default function BigButton(props: Props) {
  const navigate = useNavigate()

  return (

<div className="mt-10">

    <button
        onClick={() => navigate(props.to)}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg cursor-pointer"
    >
        {props.text}
    </button>

</div>

    )
}

