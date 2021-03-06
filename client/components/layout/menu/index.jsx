import React, { PureComponent } from "react";
import { withRouter } from "next/router";
import { graphql } from "react-apollo";
import Link from "next/link";
import dynamic from "next/dynamic";

import IsLoggedIn from "./auth/isLoggedIn";
import IsNotLoggedIn from "./auth/isNotLoggedIn";
import meQuery from "../../../graphql/queries/me";

// Background uses `window` and it does not exists in ssr
const DynamicBackground = dynamic(() => import("./background"), {
  ssr: false
});

class menu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    };
    this.menu = React.createRef();
  }

  openMenu = e => {
    e.preventDefault();

    if (
      this.menu.current &&
      this.menu.current.classList.contains("is-active") &&
      this.state.clicked
    ) {
      // Close menu when click 2 times
      this.setState({ clicked: false });
    } else {
      this.setState({ clicked: true }, () => {
        document.addEventListener("click", this.closeMenu);
      });
    }
  };

  closeMenu = () => {
    this.setState({ clicked: false }, () => {
      document.removeEventListener("click", this.closeMenu);
    });
  };

  render() {
    const { clicked } = this.state;
    const {
      router: { pathname },
      data: { me }
    } = this.props;

    return (
      <section
        id={pathname === "/" ? "fullpage" : ""}
        className={pathname === "/" ? "hero is-fullheight" : ""}
      >
        <div className="hero-head">
          <nav
            className="navbar"
            role="navigation"
            aria-label="main navigation"
          >
            <div className="navbar-brand">
              <Link href="/">
                <a className="navbar-item" onClick={this.closeMenu}>
                  <img
                    src="/static/img/logo.svg"
                    width="112"
                    height="30"
                    alt="logo"
                    style={{ maxHeight: "2.6rem" }}
                  />
                </a>
              </Link>

              <a
                role="button"
                className={`navbar-burger ${clicked ? "is-active" : ""}`}
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarButton"
                onClick={this.openMenu}
                ref={this.menu}
              >
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </a>
            </div>

            <div
              id="navbarButton"
              className={`navbar-menu ${clicked ? "is-active" : ""}`}
            >
              <div className="navbar-start">
                <Link href="/">
                  <a className="navbar-item" onClick={this.closeMenu}>
                    Inicio
                  </a>
                </Link>
                {me && (
                  <>
                    <Link
                      href={{
                        pathname:
                          me.type === "User"
                            ? "/profile/user"
                            : "/profile/business",
                        query: { id: me.id }
                      }}
                    >
                      <a className="navbar-item" onClick={this.closeMenu}>
                        Mi perfil
                      </a>
                    </Link>
                  </>
                )}
                <Link href="/documentation">
                  <a className="navbar-item" onClick={this.closeMenu}>
                    Documentación
                  </a>
                </Link>
                <Link href="/about">
                  <a className="navbar-item" onClick={this.closeMenu}>
                    Acerca de nosotros
                  </a>
                </Link>
              </div>

              <div className="navbar-end">
                {me ? (
                  <IsLoggedIn
                    me={me}
                    menu={this.menu}
                    clicked={clicked}
                    openMenu={this.openMenu}
                    closeMenu={this.closeMenu}
                  />
                ) : (
                  <IsNotLoggedIn closeMenu={this.closeMenu} />
                )}
              </div>
            </div>
          </nav>
        </div>

        {pathname === "/" && <DynamicBackground />}
      </section>
    );
  }
}

export default graphql(meQuery)(withRouter(menu));
