﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SetPlayerTransform : MonoBehaviour {

	// Use this for initialization
	void OnEnable () {
        gameObject.transform.position = GameManager.instance.lastPosition;
        gameObject.transform.rotation = GameManager.instance.lastRotation;
	}
}
