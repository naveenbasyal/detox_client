import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDailyEntries } from "../store/slices/dailyEntriesSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateEntry = () => {
  const dispatch = useDispatch();
  const [toggleWriteEntries, setToggleWriteEntries] = useState(false);
  const { createEntryLoading } = useSelector((state) => state?.dailyEntries);

  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    content: Yup.string()
      .trim() // Remove leading/trailing spaces
      .min(300, "Content must be at least 300 characters")
      .required("Content is required"),
    mood: Yup.string().required("Mood is required"),
    visibility: Yup.string().required("Visibility is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      content: "",
      mood: "",
      visibility: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(createDailyEntries(values));
      formik.resetForm();
      setToggleWriteEntries(false);
    },
  });

  return (
    <div className="container mt-4">
      <button
        className="btn btn-primary"
        onClick={() => setToggleWriteEntries(!toggleWriteEntries)}
      >
        {toggleWriteEntries ? "Cancel" : "Write a post"}
      </button>

      {toggleWriteEntries && (
        <form onSubmit={formik.handleSubmit} className="mt-3">
          <div className="row">
            {/* ______ Mood ______ */}
            <div className="col-lg-4 col-md-5 col-sm-12">
              <div className="mb-3">
                <label htmlFor="mood" className="form-label">
                  Mood:
                </label>
                <select
                  className={`form-select ${
                    formik.touched.mood && formik.errors.mood
                      ? "is-invalid"
                      : ""
                  }`}
                  name="mood"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.mood}
                >
                  <option value="">Choose your Mood</option>
                  <option value="excited">Excited</option>
                  <option value="normal">Normal</option>
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                  <option value="angry">Angry</option>
                  <option value="tired">Tired</option>
                  <option value="bored">Bored</option>
                  <option value="relaxed">Relaxed</option>
                  <option value="stressed">Stressed</option>
                </select>
                {formik.touched.mood && formik.errors.mood && (
                  <div className="invalid-feedback">{formik.errors.mood}</div>
                )}
              </div>
            </div>
            {/* ______ Visibility ______ */}

            <div className="col-lg-4 col-md-5 col-sm-12">
              <div className="mb-3">
                <label htmlFor="visibility" className="form-label">
                  Visibility:
                </label>
                <select
                  className={`form-select ${
                    formik.touched.visibility && formik.errors.visibility
                      ? "is-invalid"
                      : ""
                  }`}
                  name="visibility"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.visibility}
                >
                  <option value="">Choose visibility</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
                {formik.touched.visibility && formik.errors.visibility && (
                  <div className="invalid-feedback">
                    {formik.errors.visibility}
                  </div>
                )}
              </div>
            </div>
          </div>
          <textarea
            className={`form-control ${
              formik.touched.content && formik.errors.content ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="content"
            cols="30"
            rows="5"
            placeholder="Write your experience here..."
            value={formik.values.content}
          ></textarea>
          {formik.touched.content && formik.errors.content && (
            <div className="invalid-feedback">{formik.errors.content}</div>
          )}

          <button
            type="submit"
            className="btn btn-success mt-2"
            disabled={createEntryLoading || !formik.isValid}
            
          >
            {createEntryLoading ? "Posting..." : "Post"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateEntry;
