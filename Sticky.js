var React = require('react')

var _ = require('lodash')

module.exports = React.createClass({

  getDefaultProps: function(){
    return {
      zIndex: 1
    }
  },

  render: function() {
    return(
      <div data-sticky style={{overflow: 'hidden', zIndex: this.props.zIndex}} >
        <div {...this.props}>
          {this.props.children}
        </div>
      </div>
    )
  }
});
