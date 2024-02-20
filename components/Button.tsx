import { Link } from "expo-router";
import React from "react";
import { GestureResponderEvent, Pressable, PressableProps, StyleSheet, Text, View } from "react-native";

interface Props extends PressableProps {
  text: string;
  link?: string;
}

function PrimaryButton(props: Props) {
  return (
    <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#554bab" : "#7265E3",
            transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1}],
          },
          styles.button
        ]}
        {...props}
      >
        <Text className="text-white text-lg text-center font-bold">{props.text}</Text>
      </Pressable>
  );
};

const Button = (props: Props) => {
  if (props.link) {
    return (
      <Link href={props.link} asChild>
        <PrimaryButton {...props} />
      </Link>
    );
  } else {
    return <PrimaryButton {...props} />;
  }
};

export default Button;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 8,
    marginTop: 16
  },
});
