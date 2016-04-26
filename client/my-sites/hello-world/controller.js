var React = require( 'react' ),
    ReactDom = require( 'react-dom' ); //External Dependencies

const Controller = {
  helloWorld() {
    const Main = require( 'my-sites/hello-world/main' );

    // Render hello world..
    ReactDom.render(
      React.createElement( Main ),
      document.getElementById( 'primary' )
    );
  }
}

export default Controller;
