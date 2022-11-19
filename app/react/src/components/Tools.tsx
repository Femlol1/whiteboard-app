import tools  from '../assets/tools.js';

function Tools(props) {
    return (
    <div className="absolute top-0 w-full flex justify-center align-middle mt-2">
        <div className="bg-green-500 rounded-md shadow-md px-8 py-2">
            {tools.map((tool) => {
                return <button onClick={() => props.setSelected(tool.name)}><i className={`${tool.icon} ${tool.name === props.selected ? "text-white" : "text-black hover:text-gray-500 transistion duration-150"} text-xl mx-2 py-2`}></i></button>;
            })}
        </div>
      </div>
    )
  }
  
  export default Tools
  