function HomeButton() {
    const stobj = {display: "inlineBlock", padding: "10px 20px", background: "#007bff", color: "white", textDecoration: "none", borderRadius: "5px"};
return (
	<div style={{textAlign: "center", margin: "20px"}}>
		<a href="/" style={stobj}>← Back to Home</a>
	</div>);
}

export default HomeButton;