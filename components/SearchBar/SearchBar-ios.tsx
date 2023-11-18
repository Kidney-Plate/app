import React, { Component } from "react";
import {
  Pressable,
  LayoutAnimation,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TextInput,
} from "react-native";
import { InputProps, Input } from "../Input";
import { Icon } from "../Icon";
import { defaultTheme, renderNode } from "../helpers";
import { Theme } from "../helpers";
import { SearchBarIosProps } from "./types";

export type { SearchBarIosProps };

const defaultSearchIcon = (theme: Theme) => ({
  type: "ionicon",
  size: 20,
  name: "ios-search",
  color: theme?.colors?.platform?.ios?.grey,
});

const dimmedSearchIcon = (theme: Theme) => ({
  type: "ionicon",
  size: 20,
  name: "ios-search",
  color: "#303031",
});

const defaultClearIcon = (theme: Theme) => ({
  type: "ionicon",
  name: "ios-close-circle",
  size: 20,
  color: theme?.colors?.platform?.ios?.grey,
});

const dimmedClearIcon = (theme: Theme) => ({
  type: "ionicon",
  name: "ios-close-circle",
  size: 20,
  color: "#303031",
});

type SearchBarState = {
  hasFocus: boolean;
  isEmpty: boolean;
  cancelButtonWidth: number | null;
};

export class SearchBarIOS extends Component<SearchBarIosProps, SearchBarState> {
  input!: TextInput;
  static defaultProps = {
    value: "",
    dimmed: false,
    cancelButtonTitle: "Cancel",
    loadingProps: {},
    cancelButtonProps: {},
    showLoading: false,
    onClear: () => null,
    onCancel: () => null,
    onFocus: () => null,
    onBlur: () => null,
    onChangeText: () => null,
    searchIcon: { name: "ios-search" },
    clearIcon: { name: "ios-close-circle" },
    showCancel: false,
  };

  constructor(props: SearchBarIosProps) {
    super(props);
    const { value } = props;
    this.state = {
      hasFocus: false,
      isEmpty: value ? value === "" : true,
      cancelButtonWidth: null,
    };
  }

  focus = () => {
    this.input.focus();
  };

  blur = () => {
    this.input.blur();
  };

  clear = () => {
    this.input.clear();
    this.onChangeText("");
    if (this.props.onClear) {
      this.props.onClear();
    }
  };

  cancel = () => {
    this.onChangeText("");
    if (this.props.showCancel) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ hasFocus: false });
    }
    setTimeout(() => {
      this.blur();
      if (this.props.onCancel) {
        this.props.onCancel();
      }
    }, 0);
  };

  onFocus: InputProps["onFocus"] = (event) => {
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      hasFocus: true,
      isEmpty: this.props.value === "",
    });
  };

  onBlur: InputProps["onBlur"] = (event) => {
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
    if (!this.props.showCancel) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({
        hasFocus: false,
      });
    }
  };

  onChangeText = (text: string) => {
    if (this.props.onChangeText) {
      this.props.onChangeText(text);
    }
    this.setState({ isEmpty: text === "" });
  };

  render() {
    const {
      theme = defaultTheme,
      cancelButtonProps,
      cancelButtonTitle,
      clearIcon,
      containerStyle,
      leftIconContainerStyle,
      rightIconContainerStyle,
      inputContainerStyle,
      inputStyle,
      placeholderTextColor,
      showLoading,
      loadingProps,
      searchIcon,
      showCancel,
      ...attributes
    } = this.props;
    const { hasFocus, isEmpty } = this.state;
    const { style: loadingStyle, ...otherLoadingProps } = loadingProps;
    const {
      buttonStyle,
      buttonTextStyle,
      color: buttonColor,
      disabled: buttonDisabled,
      buttonDisabledStyle,
      buttonDisabledTextStyle,
      ...otherCancelButtonProps
    } = cancelButtonProps;

    return (
      <View
        testID="RNE__SearchBar-wrapper"
        style={StyleSheet.flatten([
          styles.container,
          // { backgroundColor: !this.props.dimmed ? theme?.colors?.background : theme?.colors?.dimmedBackground },
          containerStyle,
        ])}
      >
        <Input
          testID="RNE__SearchBar"
          renderErrorMessage={false}
          {...attributes}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChangeText={this.onChangeText}
          // @ts-ignore
          ref={(input: TextInput) => {
            this.input = input;
          }}
          inputStyle={StyleSheet.flatten([styles.input, inputStyle])}
          containerStyle={{
            paddingHorizontal: 0,
          }}
          inputContainerStyle={StyleSheet.flatten([
            styles.inputContainer,
            {
              backgroundColor: !this.props.dimmed
                ? theme?.colors?.platform?.ios?.searchBg
                : "#474747",
            },
            hasFocus && {
              marginRight: this.state.cancelButtonWidth
                ? this.state.cancelButtonWidth
                : 0,
            },
            inputContainerStyle,
          ])}
          leftIcon={renderNode(
            Icon,
            searchIcon,
            this.props.dimmed
              ? dimmedSearchIcon(theme)
              : defaultSearchIcon(theme)
          )}
          leftIconContainerStyle={StyleSheet.flatten([
            styles.leftIconContainerStyle,
            leftIconContainerStyle,
          ])}
          placeholderTextColor={
            placeholderTextColor || theme?.colors?.platform?.ios?.grey
          }
          rightIcon={
            <View style={{ flexDirection: "row" }}>
              {showLoading && (
                <ActivityIndicator
                  key="loading"
                  style={StyleSheet.flatten([{ marginRight: 5 }, loadingStyle])}
                  {...otherLoadingProps}
                />
              )}
              {!isEmpty &&
                renderNode(Icon, clearIcon, {
                  ...(this.props.dimmed
                    ? dimmedClearIcon(theme)
                    : defaultClearIcon(theme)),
                  key: "cancel",
                  onPress: this.clear,
                })}
            </View>
          }
          rightIconContainerStyle={StyleSheet.flatten([
            styles.rightIconContainerStyle,
            rightIconContainerStyle,
          ])}
        />

        <View
          style={StyleSheet.flatten([
            styles.cancelButtonContainer,
            {
              opacity: this.state.cancelButtonWidth === null ? 0 : 1,
              right: hasFocus
                ? 0
                : this.state.cancelButtonWidth && -this.state.cancelButtonWidth,
            },
          ])}
          onLayout={(event) =>
            this.setState({ cancelButtonWidth: event.nativeEvent.layout.width })
          }
          testID="RNE__SearchBar-cancelButtonContainer"
        >
          <Pressable
            accessibilityRole="button"
            onPress={this.cancel}
            disabled={buttonDisabled}
            {...otherCancelButtonProps}
          >
            <View
              style={StyleSheet.flatten([
                buttonStyle,
                buttonDisabled && buttonDisabledStyle,
              ])}
              testID="RNE__SearchBar-cancelButton"
            >
              <Text
                style={StyleSheet.flatten([
                  styles.buttonTextStyle,
                  buttonColor && { color: buttonColor },
                  buttonTextStyle,
                  buttonDisabled &&
                    (buttonDisabledTextStyle || styles.buttonTextDisabled),
                ])}
              >
                {cancelButtonTitle}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 13,
    paddingTop: 13,
    flexDirection: "row",
    overflow: "hidden",
    alignItems: "center",
  },
  input: {
    marginLeft: 4,
    overflow: "hidden",
  },
  inputContainer: {
    borderBottomWidth: 0,
    borderRadius: 9,
    minHeight: 36,
    maxHeight: 39,
    marginLeft: 8,
    marginRight: 8,
  },
  rightIconContainerStyle: {
    marginRight: 8,
  },
  leftIconContainerStyle: {
    marginLeft: 8,
  },
  buttonTextStyle: {
    color: "#007aff",
    textAlign: "center",
    padding: 8,
    fontSize: 18,
  },
  buttonTextDisabled: {
    color: "#cdcdcd",
  },
  cancelButtonContainer: {
    position: "absolute",
  },
});
