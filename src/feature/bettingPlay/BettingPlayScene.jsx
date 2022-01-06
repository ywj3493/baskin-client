import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TubeBufferGeometry } from 'three';

function CoinMesh(props) {
    const mesh = useRef(null);

    const [clicked, setClicked] = useState(false);

    useFrame(() => (mesh.current.rotation.z = mesh.current.rotation.x += 0.01));

    return <mesh 
        {...props}
        ref={mesh} 
        scale={clicked ? 1.5 : 1} 
        onClick={()=> {
            if(props.onCoinClick(props.idx)) {
                setClicked(!clicked);
            }
        }}
        >
        <cylinderBufferGeometry args={[3, 3, 1, 32]} />
        <meshLambertMaterial attach={"material"} color={"#ff1414"} />
    </mesh>
}

function BettingPlayScene(props) {
    const { numPlayer, betAmount, maxCall } = props;
    const [coins, setCoins] = useState([]);
    const [playLog, setPlayLog] = useState({});
    useEffect(()=> {
        let tempCoins = [];
        for(let i = 0; i < numPlayer * betAmount; i++) {
            tempCoins[i] = false;
        }
        setCoins(tempCoins);
    }, []);

    /**
     * 누른 코인 개수가 maxCall 수를 넘는지 안 넘는지 체크 넘으면 true, 안 넘으면 false
     * @returns {boolean}
     */
    const isClickedCoinOverMaxCall = () => {
        let count = 0;
        for(let i in coins) {
            if(coins[i]) count++;
        }
        return maxCall > count ? false : true;
    }

    /**
     * 
     * @param {number} idx 
     * @returns {boolean}
     */
    const onCoinClick = (idx) => {
        if(coins[idx]) {
            coins[idx] = !coins[idx];
            return true;
        }else {
            if(isClickedCoinOverMaxCall()) {
                console.dir("isClickedCoinOberMaxCall");
                return false;
            }else {
                coins[idx] = !coins[idx];
            }
        }
        console.dir(coins);
        return true;
    }

    return <Canvas orthographic camera={{zoom:10}}>
        {coins.map((value, idx)=>(<CoinMesh position={[-idx*10, 0, 0]} clicked={value} onCoinClick={onCoinClick} idx={idx}></CoinMesh>))}
    </Canvas>
}

export default BettingPlayScene;