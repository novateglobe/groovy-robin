import React from 'react';
import _ from 'lodash';

import {Link, withPrefix, classNames} from '../utils';
import ActionLink from './ActionLink';
import Submenu from './Submenu';

export default class Header extends React.Component {
    render() {
        return (
            <header id="masthead" className="site-header outer">
              <div className="inner">
                <div className="site-header-inside">
                  <div className="site-branding">
                    {_.get(this.props, 'data.config.header.logo_img', null) ? (
                    <p className="site-logo"><Link href={withPrefix(_.get(this.props, 'data.config.header.url', null) || '/')}><img src={withPrefix(_.get(this.props, 'data.config.header.logo_img', null))} alt={_.get(this.props, 'data.config.header.title', null)} /></Link></p>
                    ) : 
                    <p className="site-title"><Link href={withPrefix(_.get(this.props, 'data.config.header.url', null) || '/')}>{_.get(this.props, 'data.config.header.title', null)}</Link></p>
                    }
                  </div>
                  {_.get(this.props, 'data.config.header.has_nav', null) && (<React.Fragment>
                  <nav id="main-navigation" className="site-navigation" aria-label="Main Navigation">
                    <div className="site-nav-inside">
                      <button id="menu-close" className="menu-toggle"><span className="screen-reader-text">Open Menu</span><span className="icon-close" aria-hidden="true" /></button>
                      <ul className="menu">
                        {_.map(_.get(this.props, 'data.config.header.nav_links', null), (action, action_idx) => (
                        <li key={action_idx} className={classNames('menu-item', {'has-children': _.get(action, 'has_subnav', null) && _.get(action, 'subnav_links', null), 'current': _.get(this.props, 'page.__metadata.urlPath', null) === _.get(action, 'url', null), 'menu-button': _.get(action, 'style', null) !== 'link'})}>
                          <ActionLink {...this.props} action={action} />
                          {(_.get(action, 'has_subnav', null) && _.get(action, 'subnav_links', null)) && (
                            <Submenu {...this.props} submenu={_.get(action, 'subnav_links', null)} menu_class={'submenu'} page={this.props.page} />
                          )}
                        </li>
                        ))}
                      </ul>
                    </div>
                  </nav>
                  <button id="menu-open" className="menu-toggle"><span className="screen-reader-text">Close Menu</span><span className="icon-menu" aria-hidden="true" /></button>
                  </React.Fragment>)}
                </div>
              </div>
            </header>
        );
    }
}
