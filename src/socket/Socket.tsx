import React from "react";
import SocketIO from "socket.io-client";
import { authService } from "services/auth.service";
import { connect } from "react-redux";
import { config } from "config";
import { warning, debug } from "./utils";
import { SocketContext } from "./SocketContext";
import socketHolder from "lib/socketHolder";

interface ISocketProps {
  uri?: string;
  children: any;
  loggedIn: boolean;
}

class Socket extends React.Component<ISocketProps> {
  private socket;

  state = {
    updated: false,
  };

  constructor(props) {
    super(props);
    this.connect();
  }

  componentDidUpdate(prevProps: any) {
    const { loggedIn } = this.props;
    if (prevProps.loggedIn !== loggedIn) {
      this.connect();
    }
    return true;
  }

  componentWillUnmount() {
    this.socket && this.socket.close();
  }

  async login() {
    if (!this.socket) {
      return false;
    }

    const token = await authService.getAccessToken();
    return this.socket.emit("auth/login", {
      token,
    });
  }

  async connect() {
    const { loggedIn } = this.props;
    const token = loggedIn && (await authService.getAccessToken());
    console.log("token", token);
    const { uri = config.extra.apiEndpoint } = this.props;
    const options = {
      transports: ["websocket"],
      query: token ? `token=${token}` : "",
    };

    // this.socket && this.socket.close();

    this.socket = SocketIO(uri, this.mergeOptions(options));

    this.socket.status = "initialized";

    this.socket.on("connect", () => {
      this.socket.status = "connected";
      if (token) {
        this.login();
      }
      debug("socket connected");
    });

    this.socket.on("disconnect", () => {
      this.socket.status = "disconnected";
      debug("socket disconnect");
    });

    this.socket.on("error", (err) => {
      this.socket.status = "failed";
      warning("error", err);
    });

    this.socket.on("reconnect", (data) => {
      this.socket.status = "connected";
      if (token) {
        this.login();
      }
      debug("reconnect", data);
    });

    this.socket.on("reconnect_attempt", () => {
      debug("reconnect_attempt");
    });

    this.socket.on("reconnecting", () => {
      this.socket.status = "reconnecting";
      debug("reconnecting");
    });

    this.socket.on("reconnect_failed", (error) => {
      this.socket.status = "failed";
      warning("reconnect_failed", error);
    });

    socketHolder.setSocket(this.socket);
  }

  mergeOptions(options = {}) {
    const defaultOptions = {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1 * 1000,
      reconnectionDelayMax: 5 * 1000,
      autoConnect: true,
      transports: ["websocket", "polling", "long-polling"],
      rejectUnauthorized: false,
    };
    return { ...defaultOptions, ...options };
  }

  render() {
    const { children } = this.props;
    return (
      <SocketContext.Provider value={this.socket}>
        {React.Children.only(children)}
      </SocketContext.Provider>
    );
  }
}

const mapStates = (state: any) => ({
  loggedIn: state.auth.loggedIn,
});

export default connect(mapStates)(Socket);
