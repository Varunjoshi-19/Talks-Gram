import useElementStore from "../States/index"

const {menuOptionRef} = useElementStore();

export const styles = {    

left : menuOptionRef?.current ? menuOptionRef.current.offsetWidth : 0





} as React.CSSProperties;