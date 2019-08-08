import React from "react";
import {
  TouchableWithoutFeedback,
  View,
  GestureResponderEvent
} from "react-native";
import { Spring, animated } from "react-spring/native";

export interface ITouchScaleProps {
  style: any;
  onPress?: (event?: GestureResponderEvent) => void;
}

const ViewAnimated: any = animated(View);

export default class TouchScale extends React.PureComponent<ITouchScaleProps> {
  static defaultProps = {
    style: {},
    onPress: () => {}
  };

  state = {
    onTouching: false
  };

  toggle = () => {
    const { onTouching } = this.state;
    this.setState({ onTouching: !onTouching });
  };

  render() {
    const { children, style, onPress } = this.props;
    const { onTouching } = this.state;
    return (
      <TouchableWithoutFeedback
        onPressIn={this.toggle}
        onPressOut={this.toggle}
        onPress={onPress}
      >
        <View>
          <Spring
            from={{ scale: 1 }}
            to={{ scale: onTouching ? 0.9 : 1 }}
            config={{
              tension: 300,
            }}
          >
            {props => {
              return (
                <ViewAnimated
                  style={[style, { transform: [{ scale: props.scale }] }]}
                >
                  {children}
                </ViewAnimated>
              );
            }}
          </Spring>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
