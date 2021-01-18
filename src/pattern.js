import React from 'react'


export const Pattern = props => {
    const {
        pattern,
        setPattern,
        noAddition=false,
        name='some-pattern'
    } = props

    const updatePattern = (idx, value) => {
        console.log(`UPDATING ${value}`)
        setPattern(pattern.map(
            (s, i) => {
                if (idx === i) return value
                return s
            }
        ))
    }

    let patterns = pattern.map(
    (i, idx) => (
        <Step name={name} toggle={() => updatePattern(idx, !i)} on={i} key={idx} idx={idx}/>
    ))
    if (!noAddition) patterns.push(<Step isButton={true} add={() => setPattern([...pattern, false])}/>)

    return (
        <div>
            <table>
                <tr>
                    {patterns}            
                </tr>
            </table>
        </div>
    )
}

export const Step = props => {
    const {
        on=false,
        toggle,
        isButton=false,
        add,
        name,
        idx,
    } = props

    const style= {
        border: '1px black solid',
        userSelect: 'none',
        width: '30px',
        height: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
    const onStyle = {
        ...style,
        backgroundColor: 'black',
        color: 'black',
    }
    const offStyle = {
        ...style,
        backgroundColor: 'white',
        color: 'white',
    }
    
    const additionButton = <div onClick={add} style={style}>+</div>
    const step = <div onClick={toggle} style={on ? onStyle : offStyle}>o</div>

    return (
        <td id={`${name}-${idx}`}>
            { isButton ? additionButton : step }
        </td>
    )
}