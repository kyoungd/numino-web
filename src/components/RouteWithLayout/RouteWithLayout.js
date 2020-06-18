import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const RouteWithLayout = props => {
  const {
    layout: Layout,
    component: Component,
    token,
    isProtected,
    loginRelated,
    redirect,
    ...rest
  } = props;

  if (
    (isProtected && loginRelated && token.length === 0) ||
    (isProtected && !loginRelated && token.length > 0) ||
    !isProtected
  ) {
    return (
      <Route
        {...rest}
        render={matchProps => (
          <Layout>
            <Component {...matchProps} />
          </Layout>
        )}
      />
    );
  } else {
    return <Redirect to={redirect} />;
  }
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

const mapStateToProps = state => ({
  token: state.user.token
});

export default connect(mapStateToProps, {})(RouteWithLayout);
